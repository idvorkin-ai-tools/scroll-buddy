// Main controller for switching between walker and scuba buddies
(function() {
    let currentBuddy = 'walker';

    // Initialize with walker by default
    document.addEventListener('DOMContentLoaded', function() {
        initWalker();

        const toggleButton = document.getElementById('toggle-buddy');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleBuddy);
        }
    });

    function initWalker() {
        removeScuba();
        if (!window.ScrollBuddy.walker) {
            window.ScrollBuddy.walker = window.ScrollBuddy.initWalker();
        }
        currentBuddy = 'walker';
        updateButtonText();
    }

    function initScuba() {
        removeWalker();
        if (!window.ScrollBuddy.scuba) {
            window.ScrollBuddy.scuba = window.ScrollBuddy.initScuba();
        }
        currentBuddy = 'scuba';
        updateButtonText();
    }

    function removeWalker() {
        const walker = document.getElementById('walker');
        if (walker) {
            walker.remove();
        }
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.remove();
        }
        const walkerStyles = document.getElementById('walker-styles');
        if (walkerStyles) {
            walkerStyles.remove();
        }
        window.ScrollBuddy.walker = null;
    }

    function removeScuba() {
        const scuba = document.getElementById('scubaBuddy');
        if (scuba) {
            scuba.remove();
        }
        const scubaStyles = document.getElementById('scuba-styles');
        if (scubaStyles) {
            scubaStyles.remove();
        }
        window.ScrollBuddy.scuba = null;
    }

    function toggleBuddy() {
        if (currentBuddy === 'walker') {
            initScuba();
        } else {
            initWalker();
        }
    }

    function updateButtonText() {
        const toggleButton = document.getElementById('toggle-buddy');
        if (toggleButton) {
            if (currentBuddy === 'walker') {
                toggleButton.textContent = 'Switch to Scuba Diver';
            } else {
                toggleButton.textContent = 'Switch to Walker';
            }
        }
    }

    // Export for debugging
    window.ScrollBuddy = window.ScrollBuddy || {};
    window.ScrollBuddy.toggle = toggleBuddy;
    window.ScrollBuddy.currentBuddy = () => currentBuddy;
})();
