const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Factorial function
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}


const customFunctions = {
    deg2rad: (deg) => deg * (Math.PI / 180),
    rad2deg: (rad) => rad * (180 / Math.PI),
    factorial: factorial,
};

// Main evaluation function
function evaluateExpression(expression) {
    expression = expression.replace(/[^0-9+\-.*\/()^!%πesincotagl√\s]/g, '');

    if (/(\/\s*0(?!\.))|(\/\s*\(.*0\))/.test(expression)) {
        return {
            success: false,
            error: 'Division by zero'
        };
    }

    expression = expression
        .replace(/\^/g, '**')
        .replace(/√/g, 'Math.sqrt')
        .replace(/π/g, 'Math.PI')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/deg/g, 'deg2rad')
        .replace(/rad/g, 'rad2deg')
        .replace(/!/g, 'factorial');

    if (expression.includes('factorial')) {
        expression = expression.replace(/factorial\((\d+)\)/g, (match, n) => {
            return factorial(parseInt(n));
        });
    }

    try {
        const safeEval = (expr) => {
            const context = {
                ...Math,
                ...customFunctions
            };
            return Function('"use strict"; return (' + expr + ')').call(context);
        };

        const result = safeEval(expression);

        if (!isFinite(result) || isNaN(result)) {
            return {
                success: false,
                error: 'Math error'
            };
        }

        return {
            success: true,
            result: result,
            expression: expression
        };
    } catch (e) {
        return {
            success: false,
            error: 'Invalid expression'
        };
    }
}


app.post('/calculate', (req, res) => {
    const expression = req.body.expression || '';
    const result = evaluateExpression(expression);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
