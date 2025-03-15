import { NextApiRequest, NextApiResponse } from 'next';
import { generatePDFReport } from '../../services/pdfService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const quizState = req.body;

    if (!quizState || !quizState.scores) {
      return res.status(400).json({ message: 'Invalid quiz state' });
    }

    const pdfBuffer = await generatePDFReport(quizState);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=experimentation-maturity-report.pdf');
    
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ message: 'Error generating PDF' });
  }
} 