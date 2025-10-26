// Walker Scroll Buddy
(function() {
    const styleContent = `
        #walker {
            position: fixed;
            right: 10px;
            top: 50%;
            width: 50px;
            height: 70px;
            transition: top 0.1s ease-out;
            transform: rotate(270deg);
            z-index: 1000;
            transform-origin: center center;
            cursor: grab;
        }

        #walker.scrolling-up {
            transform: rotate(270deg) scaleX(-1);
        }

        #walker::before {
            content: 'Scroll Buddy';
            position: absolute;
            top: -5px;
            left: -10%;
            transform: translateX(-50%) rotate(90deg);
            color: #999;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        #walker.scrolling-up::before {
            transform: translateX(-50%) rotate(-90deg) scaleX(-1);
        }

        #walker.show-text::before {
            opacity: 1;
        }

        #walker:hover::before {
            opacity: 1;
        }

        @media (hover: none) {
            #walker {
                width: 50px;
                height: 70px;
                right: 0;
            }
            #walker:hover::before {
                opacity: 0;
            }
        }

        .w-head {
            width: 10px;
            height: 10px;
            background: #000;
            border-radius: 50%;
            position: absolute;
            left: 8px;
            top: 0;
        }

        .w-body {
            width: 2px;
            height: 20px;
            background: #000;
            position: absolute;
            left: 12px;
            top: 10px;
        }

        .w-left-arm,
        .w-right-arm {
            width: 10px;
            height: 2px;
            background: #000;
            position: absolute;
            transform: rotate(90deg);
        }

        .w-left-arm {
            left: 13px;
            top: 15px;
            transform-origin: left center;
        }

        .w-right-arm {
            left: 13px;
            top: 15px;
            transform-origin: left center;
        }

        .w-left-forearm,
        .w-right-forearm {
            left: 13px;
            top: 15px;
            width: 8px;
            height: 2px;
            background: #000;
            position: absolute;
            transform-origin: left center;
        }

        .w-left-upper-leg,
        .w-right-upper-leg {
            width: 12px;
            height: 2px;
            background: #000;
            position: absolute;
            transform-origin: top left;
        }

        .w-left-upper-leg {
            left: 14px;
            top: 30px;
        }

        .w-right-upper-leg {
            left: 14px;
            top: 30px;
        }

        .w-left-lower-leg,
        .w-right-lower-leg {
            left: 14px;
            top: 30px;
            width: 10px;
            height: 2px;
            background: #000;
            position: absolute;
            transform-origin: top left;
        }

        .w-left-foot,
        .w-right-foot {
            left: 14px;
            top: 30px;
            width: 8px;
            height: 2px;
            background: #000;
            position: absolute;
            transform-origin: left center;
        }

        @media (prefers-reduced-motion: reduce) {
            #walker {
                display: none;
            }
        }

        #back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: transparent;
            border: none;
            color: #999;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        #back-to-top.visible {
            opacity: 1;
        }

        #back-to-top:hover {
            color: #2196F3;
        }
    `;

    function initWalker() {
        // Add or re-add styles
        let style = document.getElementById('walker-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'walker-styles';
            style.textContent = styleContent;
            document.head.appendChild(style);
        }

        // Create walker element
        const walker = document.createElement('div');
        walker.id = 'walker';
        walker.innerHTML = `
            <div class="w-head"></div>
            <div class="w-body"></div>
            <div class="w-left-arm"></div>
            <div class="w-left-forearm"></div>
            <div class="w-right-arm"></div>
            <div class="w-right-forearm"></div>
            <div class="w-left-upper-leg"></div>
            <div class="w-left-lower-leg"></div>
            <div class="w-left-foot"></div>
            <div class="w-right-upper-leg"></div>
            <div class="w-right-lower-leg"></div>
            <div class="w-right-foot"></div>
        `;
        document.body.appendChild(walker);

        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.textContent = 'Back to top';
        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        function updateBackToTopVisibility() {
            if (window.scrollY > window.innerHeight / 2) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', updateBackToTopVisibility);
        updateBackToTopVisibility();

        // Animation variables
        let textTimer = null;
        let lastScrollY = window.scrollY;
        let isScrollingUp = false;
        let isDragging = false;
        let startY = 0;
        let lastY = 0;
        let lastTime = 0;
        let velocity = 0;

        function showTextTemporarily() {
            walker.classList.add('show-text');
            if (textTimer) {
                clearTimeout(textTimer);
            }
            textTimer = setTimeout(() => {
                walker.classList.remove('show-text');
            }, 3000);
        }

        // Drag to scroll functionality
        walker.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            lastY = e.clientY;
            lastTime = Date.now();
            walker.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            const deltaY = e.clientY - lastY;
            velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollMultiplier = (documentHeight - viewportHeight) / (viewportHeight * 0.8);

            window.scrollBy(0, deltaY * scrollMultiplier);
            lastY = e.clientY;
            lastTime = currentTime;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            velocity = 0;
            walker.style.cursor = 'grab';
        });

        // Touch support
        walker.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            lastY = e.touches[0].clientY;
            lastTime = Date.now();
            showTextTemporarily();
            e.preventDefault();
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            const deltaY = e.touches[0].clientY - lastY;
            velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollMultiplier = (documentHeight - viewportHeight) / (viewportHeight * 0.8);

            window.scrollBy(0, deltaY * scrollMultiplier);
            lastY = e.touches[0].clientY;
            lastTime = currentTime;
            e.preventDefault();
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
            velocity = 0;
        });

        walker.style.cursor = 'grab';

        // Animation state
        let lastScroll = 0;
        let walkPhase = 0;
        const walkSpeed = 0.0314;

        // Check for reduced motion preference
        const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersReducedMotion = prefersReducedMotionQuery.matches ||
                                   navigator.platform.toLowerCase().includes('mac') &&
                                   window.matchMedia('(-apple-reduce-motion: reduce)').matches;

        if (prefersReducedMotion) {
            walker.style.display = 'none';
        }

        // Get body parts
        const leftArm = walker.querySelector('.w-left-arm');
        const rightArm = walker.querySelector('.w-right-arm');
        const leftForearm = walker.querySelector('.w-left-forearm');
        const rightForearm = walker.querySelector('.w-right-forearm');
        const leftUpperLeg = walker.querySelector('.w-left-upper-leg');
        const rightUpperLeg = walker.querySelector('.w-right-upper-leg');
        const leftLowerLeg = walker.querySelector('.w-left-lower-leg');
        const rightLowerLeg = walker.querySelector('.w-right-lower-leg');
        const leftFoot = walker.querySelector('.w-left-foot');
        const rightFoot = walker.querySelector('.w-right-foot');

        // Set static poses for reduced motion
        if (prefersReducedMotion) {
            leftArm.style.transform = rightArm.style.transform = 'rotate(90deg)';
            leftForearm.style.transform = rightForearm.style.transform = 'rotate(90deg)';
            leftUpperLeg.style.transform = rightUpperLeg.style.transform = 'rotate(90deg)';
            leftLowerLeg.style.transform = rightLowerLeg.style.transform = 'rotate(90deg)';
            leftFoot.style.transform = rightFoot.style.transform = 'rotate(180deg)';
        }

        function updateArms(phase) {
            if (prefersReducedMotion) return;

            const upperArmAngle = Math.sin(phase) * 30;
            leftArm.style.transform = `rotate(${90 + upperArmAngle}deg)`;
            rightArm.style.transform = `rotate(${90 - upperArmAngle}deg)`;

            const leftForearmAngle = Math.sin(phase + Math.PI / 4) * 20 * (upperArmAngle > 0 ? 1 : 0.2);
            const rightForearmAngle = Math.sin(phase + Math.PI / 4) * 20 * (upperArmAngle < 0 ? 1 : 0.2);

            const leftElbowX = Math.cos((90 + upperArmAngle) * Math.PI / 180) * 10;
            const leftElbowY = Math.sin((90 + upperArmAngle) * Math.PI / 180) * 10;
            const rightElbowX = Math.cos((90 - upperArmAngle) * Math.PI / 180) * 10;
            const rightElbowY = Math.sin((90 - upperArmAngle) * Math.PI / 180) * 10;

            leftForearm.style.transform = `translate(${leftElbowX}px, ${leftElbowY}px) rotate(${90 + upperArmAngle + leftForearmAngle}deg)`;
            rightForearm.style.transform = `translate(${rightElbowX}px, ${rightElbowY}px) rotate(${90 - upperArmAngle - rightForearmAngle}deg)`;
        }

        function updateLegs(phase) {
            if (prefersReducedMotion) return;

            const baseUpperLegAngle = Math.sin(phase) * 25;
            const leftUpperLegAngle = baseUpperLegAngle < 0 ? baseUpperLegAngle * 1.5 : baseUpperLegAngle;
            const rightUpperLegAngle = baseUpperLegAngle > 0 ? baseUpperLegAngle * 1.5 : baseUpperLegAngle;

            leftUpperLeg.style.transform = `rotate(${90 - leftUpperLegAngle}deg)`;
            rightUpperLeg.style.transform = `rotate(${90 + rightUpperLegAngle}deg)`;

            const lowerLegAngle = Math.sin(phase + Math.PI / 4) * 20;

            const leftBlend = Math.min(1, Math.max(0, (-leftUpperLegAngle + 10) / 20));
            const rightBlend = Math.min(1, Math.max(0, (rightUpperLegAngle + 10) / 20));

            const leftLowerLegAngle = lowerLegAngle * (1 - leftBlend) + (lowerLegAngle * -0.7) * leftBlend;
            const rightLowerLegAngle = lowerLegAngle * (1 - rightBlend) + (lowerLegAngle * -0.7) * rightBlend;

            const leftKneeX = Math.cos((90 - leftUpperLegAngle) * Math.PI / 180) * 12;
            const leftKneeY = Math.sin((90 - leftUpperLegAngle) * Math.PI / 180) * 12;
            const rightKneeX = Math.cos((90 + rightUpperLegAngle) * Math.PI / 180) * 12;
            const rightKneeY = Math.sin((90 + rightUpperLegAngle) * Math.PI / 180) * 12;

            leftLowerLeg.style.transform = `translate(${leftKneeX}px, ${leftKneeY}px) rotate(${90 - leftUpperLegAngle - leftLowerLegAngle}deg)`;
            rightLowerLeg.style.transform = `translate(${rightKneeX}px, ${rightKneeY}px) rotate(${90 + rightUpperLegAngle + rightLowerLegAngle}deg)`;

            const leftAnkleX = leftKneeX + Math.cos((90 - leftUpperLegAngle - leftLowerLegAngle) * Math.PI / 180) * 10;
            const leftAnkleY = leftKneeY + Math.sin((90 - leftUpperLegAngle - leftLowerLegAngle) * Math.PI / 180) * 10;
            const rightAnkleX = rightKneeX + Math.cos((90 + rightUpperLegAngle + rightLowerLegAngle) * Math.PI / 180) * 10;
            const rightAnkleY = rightKneeY + Math.sin((90 + rightUpperLegAngle + rightLowerLegAngle) * Math.PI / 180) * 10;

            const footAngle = Math.sin(phase) * 15;
            leftFoot.style.transform = `translate(${leftAnkleX}px, ${leftAnkleY}px) rotate(${180 - footAngle}deg)`;
            rightFoot.style.transform = `translate(${rightAnkleX}px, ${rightAnkleY}px) rotate(${180 + footAngle}deg)`;
        }

        function updateVerticalPosition(scrollPosition) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollPosition / (documentHeight - windowHeight);
            const walkerHeight = walker.offsetHeight;
            const maxTop = windowHeight - walkerHeight;
            const newTop = scrollPercent * maxTop;

            requestAnimationFrame(() => {
                walker.style.top = `${newTop}px`;
            });
        }

        function updateWalker() {
            const scrollPosition = window.scrollY;
            const scrollDelta = scrollPosition - lastScroll;

            isScrollingUp = scrollPosition < lastScrollY;
            lastScrollY = scrollPosition;

            if (isScrollingUp) {
                walker.classList.add('scrolling-up');
            } else {
                walker.classList.remove('scrolling-up');
            }

            if (!prefersReducedMotion) {
                walkPhase += scrollDelta * walkSpeed;
                updateArms(walkPhase);
                updateLegs(walkPhase);
            }

            updateVerticalPosition(scrollPosition);
            lastScroll = scrollPosition;
        }

        function initWalkerPosition() {
            updateWalker();
        }

        if (document.readyState === 'complete') {
            initWalkerPosition();
        } else {
            window.onload = initWalkerPosition;
        }

        prefersReducedMotionQuery.addEventListener('change', (e) => {
            location.reload();
        });

        window.matchMedia('(-apple-reduce-motion: reduce)').addEventListener('change', (e) => {
            location.reload();
        });

        window.addEventListener('scroll', updateWalker);
        window.addEventListener('resize', updateWalker);

        return walker;
    }

    // Export for external control
    window.ScrollBuddy = window.ScrollBuddy || {};
    window.ScrollBuddy.initWalker = initWalker;
    window.ScrollBuddy.walker = null;
})();
