# Experimentation Maturity Assessment

A web application that helps organizations assess their experimentation maturity across different dimensions.

## Features

- Interactive quiz with dynamic progress tracking
- Dark mode support
- Detailed persona analysis and recommendations
- PDF report generation
- Mobile-responsive design
- Accessible UI components using Headless UI

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Option 1: Standalone Server

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or your configured port).

### Option 2: WordPress Integration

To integrate with WordPress:

1. Build the application:
```bash
npm run build
```

2. Copy the contents of the `.next/standalone` directory to your WordPress theme directory (e.g., `wp-content/themes/your-theme/quiz`).

3. Add the following to your WordPress theme's `functions.php`:

```php
function quiz_endpoint() {
    add_rewrite_rule('^quiz/?', 'index.php?quiz=1', 'top');
}
add_action('init', 'quiz_endpoint');

function quiz_query_vars($vars) {
    $vars[] = 'quiz';
    return $vars;
}
add_filter('query_vars', 'quiz_query_vars');

function quiz_template($template) {
    if (get_query_var('quiz') === '1') {
        return dirname(__FILE__) . '/quiz/server.js';
    }
    return $template;
}
add_filter('template_include', 'quiz_template');
```

4. Update `next.config.js`:
- Uncomment and configure `assetPrefix` and `basePath`
- Set them to match your WordPress subdirectory (e.g., '/quiz')

5. Flush WordPress rewrite rules in the admin panel.

The quiz will be available at `your-site.com/quiz`.

## Environment Variables

Create a `.env` file with:

```
PORT=3000 # Server port (optional, defaults to 3000)
NODE_ENV=production # For production deployment
```

## Support

For questions or support, please contact [your-email@example.com]. 