import PDFDocument from 'pdfkit';
import { QuizState } from '../context/QuizContext';
import DOMPurify from 'dompurify';

// Constants for validation
const MAX_SCORE = 100;
const MIN_SCORE = 0;
const MAX_TEXT_LENGTH = 500;
const ALLOWED_CATEGORIES = ['process', 'strategy', 'insight', 'culture'];

// Sanitize and validate user input
function sanitizeUserInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

function validateScore(score: number): number {
  return Math.min(Math.max(score, MIN_SCORE), MAX_SCORE);
}

function validateCategoryScores(scores: Record<string, number>): Record<string, number> {
  const validatedScores: Record<string, number> = {};
  
  Object.entries(scores).forEach(([category, score]) => {
    if (ALLOWED_CATEGORIES.includes(category)) {
      validatedScores[category] = validateScore(score);
    }
  });

  return validatedScores;
}

const PERSONAS = {
  beginner: {
    name: "Experimentation Explorer 🌱",
    description: "You're taking your first steps into the world of experimentation. Like a curious scientist with a fresh lab coat, you're eager to learn and grow.",
    recommendations: [
      "Start with simple A/B tests",
      "Focus on building a data-driven culture",
      "Document your experiments",
    ]
  },
  intermediate: {
    name: "Test & Learn Tactician 🚀",
    description: "You've got the basics down and are starting to see real impact. Like a skilled chef perfecting their recipes, you're refining your approach.",
    recommendations: [
      "Implement more sophisticated testing methods",
      "Develop a formal experimentation process",
      "Build cross-functional testing teams",
    ]
  },
  advanced: {
    name: "Experimentation Expert 🎯",
    description: "You're operating at an advanced level. Like a master conductor, you orchestrate complex experiments with precision and insight.",
    recommendations: [
      "Scale your experimentation program",
      "Mentor others in experimentation",
      "Pioneer new testing methodologies",
    ]
  }
};

function getPersonaLevel(score: number): keyof typeof PERSONAS {
  const validatedScore = validateScore(score);
  if (validatedScore >= 80) return 'advanced';
  if (validatedScore >= 60) return 'intermediate';
  return 'beginner';
}

function formatScore(score: number): string {
  return `${Math.round(validateScore(score))}%`;
}

export async function generatePDFReport(state: QuizState): Promise<Buffer> {
  if (!state.scores) {
    throw new Error('No scores available to generate report');
  }

  // Validate and sanitize user data
  const sanitizedUserData = state.userData ? {
    name: sanitizeUserInput(state.userData.name),
    company: sanitizeUserInput(state.userData.company),
    timestamp: state.userData.timestamp
  } : null;

  const sanitizedEmail = state.email ? sanitizeUserInput(state.email) : null;
  const validatedScores = validateCategoryScores(state.scores);

  // Create a new PDF document
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });

  // Collect the PDF data chunks
  const chunks: Buffer[] = [];
  doc.on('data', chunk => chunks.push(chunk));

  // Return a promise that resolves with the complete PDF data
  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', reject);

    try {
      // Header
      doc.fontSize(24)
         .fillColor('#2980b9')
         .text('Experimentation Maturity Assessment', { align: 'center' });

      // Date
      doc.moveDown()
         .fontSize(10)
         .fillColor('#666666')
         .text(new Date().toLocaleDateString());

      // User Info
      if (sanitizedUserData) {
        doc.moveDown()
           .fontSize(12)
           .fillColor('#000000');

        doc.text(`Name: ${sanitizedUserData.name || 'Not provided'}`);
        doc.text(`Company: ${sanitizedUserData.company || 'Not provided'}`);
        doc.text(`Email: ${sanitizedEmail || 'Not provided'}`);
      }

      // Overall Score and Persona
      const persona = PERSONAS[getPersonaLevel(validatedScores.overall || 0)];
      
      doc.moveDown()
         .fontSize(16)
         .fillColor('#2980b9')
         .text('Your Results');

      doc.moveDown()
         .fontSize(14)
         .fillColor('#000000')
         .text(`Persona: ${persona.name}`)
         .text(`Overall Maturity Score: ${formatScore(validatedScores.overall || 0)}`);

      // Category Scores
      doc.moveDown()
         .fontSize(14)
         .fillColor('#2980b9')
         .text('Category Breakdown');

      doc.fontSize(12)
         .fillColor('#000000');

      const categories = [
        { name: 'Process', score: validatedScores.process },
        { name: 'Strategy', score: validatedScores.strategy },
        { name: 'Insight', score: validatedScores.insight },
        { name: 'Culture', score: validatedScores.culture },
      ];

      categories.forEach(category => {
        doc.text(`${category.name}: ${formatScore(category.score || 0)}`);
      });

      // Persona Description
      doc.moveDown()
         .fontSize(14)
         .fillColor('#2980b9')
         .text('Your Experimentation Profile');

      doc.moveDown()
         .fontSize(12)
         .fillColor('#000000')
         .text(persona.description, {
           width: 500,
           align: 'justify'
         });

      // Recommendations
      doc.moveDown()
         .fontSize(14)
         .fillColor('#2980b9')
         .text('Recommended Next Steps');

      doc.fontSize(12)
         .fillColor('#000000');

      persona.recommendations.forEach(recommendation => {
        doc.text(`• ${recommendation}`, {
          width: 500,
          bulletRadius: 2
        });
      });

      // Footer
      doc.moveDown()
         .fontSize(10)
         .fillColor('#666666')
         .text('Generated by Experimentation Maturity Assessment', {
           align: 'center'
         });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 