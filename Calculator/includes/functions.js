function evaluateExpression(expression) {
    // Remove any potentially dangerous characters
    expression = expression.replace(/[^0-9+\-.*\/()^!%πesincotagl√\s]/g, '');

    // Check for division by zero before evaluation
    if (/(\/\s*0(?!\.))|(\/\s*\(.*0\))/.test(expression)) {
        return {
            success: false,
            error: 'Division by zero'
        };
    }

    // Replace human-readable functions with JavaScript equivalents
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

    // Handle factorial replacements
    if (expression.includes('factorial')) {
        expression = expression.replace(/factorial\((\d+)\)/g, (match, n) => {
            return factorial(parseInt(n));
        });
    }

    // Custom functions
    const customFunctions = {
        deg2rad: (deg) => deg * (Math.PI / 180),
        rad2deg: (rad) => rad * (180 / Math.PI),
        factorial: factorial
    };


    try {
        const safeEval = (expr) => {
            // Allow only Math functions and our custom functions
            const context = {
                ...Math,
                ...customFunctions
            };

            // Create function with limited scope
            return Function('"use strict"; return (' + expr + ')').call(context);
        };

        const result = safeEval(expression);

        // Check for division by zero
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

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}


function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


function rad2deg(rad) {
    return rad * (180 / Math.PI);
}