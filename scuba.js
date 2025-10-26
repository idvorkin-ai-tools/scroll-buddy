// Scuba Diver Scroll Buddy
(function() {
    const styleContent = `
        #scubaBuddy {
            position: fixed;
            right: 10px;
            top: 50%;
            width: 40px;
            height: 100px;
            transition: top 0.1s ease-out;
            z-index: 1000;
            transform-origin: center;
        }

        #scubaBuddy::before {
            content: 'Scuba Buddy';
            position: absolute;
            top: -20px;
            left: -50px;
            color: #999;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        #scubaBuddy.flipped::before {
            transform: scaleY(-1);
        }

        #scubaBuddy.show-text::before {
            opacity: 1;
        }

        #scubaBuddy:hover::before {
            opacity: 1;
        }

        @media (hover: none) {
            #scubaBuddy {
                width: 50px;
                height: 70px;
                right: 0;
            }
            #scubaBuddy:hover::before {
                opacity: 0;
            }
        }

        .head {
            width: 12px;
            height: 12px;
            background: black;
            border-radius: 50%;
            position: absolute;
            left: 14px;
            top: 0;
        }

        .mask {
            width: 16px;
            height: 8px;
            background: #2196F3;
            border: 2px solid black;
            border-radius: 4px;
            position: absolute;
            left: 12px;
            top: 2px;
        }

        .regulator {
            width: 6px;
            height: 6px;
            background: black;
            border-radius: 50%;
            position: absolute;
            left: 24px;
            top: 4px;
        }

        .tank {
            width: 10px;
            height: 24px;
            background: #808080;
            border-radius: 10px;
            position: absolute;
            left: 8px;
            top: 12px;
        }

        .body {
            width: 3px;
            height: 34px;
            background: black;
            position: absolute;
            left: 19px;
            top: 12px;
        }

        .left-arm {
            width: 15px;
            height: 3px;
            background: black;
            border-radius: 25%;
            position: absolute;
            transform-origin: left center;
            left: 21px;
            top: 18px;
            transform: rotate(70deg);
        }

        .left-forearm {
            width: 13.26px;
            height: 3px;
            background: black;
            border-radius: 25%;
            position: absolute;
            transform-origin: left center;
            left: 25.5px;
            top: 30.5px;
            transform: rotate(60deg);
        }

        .right-arm {
            width: 15px;
            height: 3px;
            background: black;
            border-radius: 25%;
            position: absolute;
            transform-origin: left center;
            left: 21px;
            top: 18px;
            transform: rotate(120deg);
        }

        .right-forearm {
            width: 13.26px;
            height: 3px;
            background: black;
            border-radius: 25%;
            position: absolute;
            transform-origin: left center;
            left: 14px;
            top: 29.8px;
            transform: rotate(70deg);
        }

        .left-leg,
        .right-leg {
            width: 3px;
            height: 15px;
            background: black;
            position: absolute;
            transform-origin: top center;
        }

        .left-leg {
            left: 19px;
            top: 45px;
        }

        .right-leg {
            left: 19px;
            top: 45px;
        }

        .left-calf,
        .right-calf {
            width: 3px;
            height: 12px;
            background: black;
            position: absolute;
        }

        .left-calf {
            left: 0;
            top: 15px;
            transform-origin: top center;
        }

        .right-calf {
            left: 0;
            top: 15px;
            transform-origin: top center;
        }

        .left-fin,
        .right-fin {
            width: 8px;
            height: 16px;
            background: #2196F3;
            position: absolute;
            transform-origin: top center;
            border-radius: 0 0 8px 8px;
            clip-path: polygon(0 0, 100% 0, 120% 100%, -20% 100%);
            box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.2);
        }

        .left-fin {
            left: -2px;
            top: 12px;
        }

        .right-fin {
            left: -2px;
            top: 12px;
        }

        @media (prefers-reduced-motion: reduce) {
            #scubaBuddy {
                display: none;
            }
        }
    `;

    function initScuba() {
        // Add or re-add styles
        let style = document.getElementById('scuba-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'scuba-styles';
            style.textContent = styleContent;
            document.head.appendChild(style);
        }

        const stickFigure = document.createElement('div');
        stickFigure.id = 'scubaBuddy';
        stickFigure.innerHTML = `
            <div class="tank"></div>
            <div class="head"></div>
            <div class="mask"></div>
            <div class="regulator"></div>
            <div class="body"></div>
            <div class="left-arm"></div>
            <div class="left-forearm"></div>
            <div class="right-arm"></div>
            <div class="right-forearm"></div>
            <div class="left-leg">
                <div class="left-calf">
                    <div class="left-fin"></div>
                </div>
            </div>
            <div class="right-leg">
                <div class="right-calf">
                    <div class="right-fin"></div>
                </div>
            </div>
        `;
        document.body.appendChild(stickFigure);

        const buddy = document.getElementById('scubaBuddy');
        let lastScroll = 0;
        let swimPhase = 0;
        const swimSpeed = 0.0314;
        let isSwimmingDown = true;

        const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersReducedMotion = prefersReducedMotionQuery.matches ||
                                   navigator.platform.toLowerCase().includes('mac') &&
                                   window.matchMedia('(-apple-reduce-motion: reduce)').matches;

        if (prefersReducedMotion) {
            buddy.style.display = 'none';
        }

        const leftArm = buddy.querySelector('.left-arm');
        const leftForearm = buddy.querySelector('.left-forearm');
        const rightArm = buddy.querySelector('.right-arm');
        const rightForearm = buddy.querySelector('.right-forearm');
        const leftLeg = buddy.querySelector('.left-leg');
        const rightLeg = buddy.querySelector('.right-leg');
        const leftCalf = buddy.querySelector('.left-calf');
        const rightCalf = buddy.querySelector('.right-calf');
        const leftFin = buddy.querySelector('.left-fin');
        const rightFin = buddy.querySelector('.right-fin');

        function updateSwimMovement(phase) {
            if (prefersReducedMotion) return;

            const legPhase = phase * 0.8;

            const getHipAngle = (phase) => {
                const angle = Math.sin(phase) * 30;
                return angle > 0 ? angle : angle * 1.4;
            };

            const leftHipAngle = getHipAngle(legPhase);
            const rightHipAngle = getHipAngle(legPhase + Math.PI);

            const getCalfAngle = (hipAngle) => {
                if (hipAngle > 0) {
                    return Math.min(35, hipAngle * 0.7);
                } else {
                    return Math.min(45, Math.abs(hipAngle * 1.2));
                }
            };

            const leftCalfAngle = getCalfAngle(leftHipAngle);
            const rightCalfAngle = getCalfAngle(rightHipAngle);

            const getFinAngle = (hipAngle, calfAngle) => {
                const baseAngle = 15;
                return -Math.sign(hipAngle) * Math.abs(Math.sin(legPhase - Math.PI/6)) * baseAngle;
            };

            const leftFinFlexAngle = getFinAngle(leftHipAngle, leftCalfAngle);
            const rightFinFlexAngle = getFinAngle(rightHipAngle, rightCalfAngle);

            leftLeg.style.transform = `rotate(${leftHipAngle}deg)`;
            leftCalf.style.transform = `rotate(${leftCalfAngle}deg)`;
            leftFin.style.transform = `rotate(${leftFinFlexAngle}deg)`;

            rightLeg.style.transform = `rotate(${rightHipAngle}deg)`;
            rightCalf.style.transform = `rotate(${rightCalfAngle}deg)`;
            rightFin.style.transform = `rotate(${rightFinFlexAngle}deg)`;
        }

        function updateBuddyVerticalPosition(scrollPosition) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = scrollPosition / (documentHeight - windowHeight);
            const buddyHeight = buddy.offsetHeight;
            const maxTop = windowHeight - buddyHeight;
            const newTop = scrollPercent * maxTop;

            requestAnimationFrame(() => {
                buddy.style.top = `${newTop}px`;
            });
        }

        function updateBuddyPosition() {
            const scrollPosition = window.scrollY;
            const scrollDelta = scrollPosition - lastScroll;

            if (scrollDelta > 0 && isSwimmingDown) {
                isSwimmingDown = false;
                buddy.style.transform = 'scaleY(-1)';
                buddy.classList.add('flipped');
            } else if (scrollDelta < 0 && !isSwimmingDown) {
                isSwimmingDown = true;
                buddy.style.transform = 'scaleY(1)';
                buddy.classList.remove('flipped');
            }

            if (!prefersReducedMotion) {
                swimPhase += scrollDelta * swimSpeed;
                updateSwimMovement(swimPhase);
            }

            updateBuddyVerticalPosition(scrollPosition);
            lastScroll = scrollPosition;
        }

        prefersReducedMotionQuery.addEventListener('change', (e) => {
            location.reload();
        });

        window.matchMedia('(-apple-reduce-motion: reduce)').addEventListener('change', (e) => {
            location.reload();
        });

        window.addEventListener('scroll', updateBuddyPosition);
        window.addEventListener('resize', updateBuddyPosition);

        updateBuddyPosition();

        return buddy;
    }

    // Export for external control
    window.ScrollBuddy = window.ScrollBuddy || {};
    window.ScrollBuddy.initScuba = initScuba;
    window.ScrollBuddy.scuba = null;
})();
