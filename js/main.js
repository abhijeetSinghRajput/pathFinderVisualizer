function main() {
    renderBoard();
    source = set('source');
    target = set('target');
}
main();

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}



// Create the debounced version of renderBoard
const repaint = debounce(main, 250);

// Attach the debounced handler to the resize event
window.addEventListener('resize', repaint);

