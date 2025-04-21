let currentExpression = '';
let lastResult = null;

function appendToExpression(value) {
    // Clear error display if present
    document.getElementById('result').classList.remove('error');

    // If last result exists and user starts with an operator, use last result
    if (lastResult !== null && /^[+\-*/^]/.test(value) && currentExpression === '') {
        currentExpression = lastResult + value;
    }
    // If equals was just pressed and user enters a number, start new expression
    else if (lastResult !== null && /^[0-9.]/.test(value)) {
        currentExpression = value;
        lastResult = null;
    }
    else {
        currentExpression += value;
    }

    updateDisplay();
    lastResult = null;
}

function clearDisplay() {
    currentExpression = '';
    lastResult = null;
    document.getElementById('result').textContent = '0';
    document.getElementById('result').classList.remove('error');
    updateDisplay();
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('expression').textContent = currentExpression;
}

async function calculate() {
    if (!currentExpression) return;

    // Show loading indicator
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Calculating...';
    resultElement.classList.remove('error');

    try {
        const response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `expression=${encodeURIComponent(currentExpression)}`
        });

        const data = await response.json();

        if (data.success) {
            resultElement.textContent = data.result;
            lastResult = data.result.toString();
        } else {
            resultElement.textContent = 'Error: ' + data.error;
            resultElement.classList.add('error');
        }
    } catch (error) {
        resultElement.textContent = 'Connection error';
        resultElement.classList.add('error');
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (/[0-9.]/.test(key)) {
        appendToExpression(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToExpression(key);
    } else if (key === '^') {
        appendToExpression('^');
    } else if (key === '(' || key === ')') {
        appendToExpression(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'p' && e.altKey) {
        appendToExpression('π');
    }
});