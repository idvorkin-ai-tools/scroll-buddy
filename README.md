# Scroll Buddy Clone

A fully functional clone of [ScrollBuddy.com](https://scrollbuddy.com/) featuring two animated characters that move along your scrollbar.

## 🎮 Live Demo

**[View Live Demo →](https://gistpreview.github.io/?9a8bd4372e3e87c37f3dbbcc6f892139/index.html)**

Try it out! Scroll the page and watch the animated buddy follow along. Click the toggle button to switch between the walker and scuba diver.

## About This Project

This project is a reverse-engineered clone of ScrollBuddy.com, created by analyzing the original website's implementation and recreating it from scratch. The original ScrollBuddy is a creative scroll indicator that adds personality to web pages through animated characters that follow your scroll position.

### Original Source

- **Original Website**: [https://scrollbuddy.com/](https://scrollbuddy.com/)
- **GitHub Repository**: [https://github.com/idvorkin-ai-tools/scroll-buddy](https://github.com/idvorkin-ai-tools/scroll-buddy)
- **Live Demo**: [https://gistpreview.github.io/?9a8bd4372e3e87c37f3dbbcc6f892139/index.html](https://gistpreview.github.io/?9a8bd4372e3e87c37f3dbbcc6f892139/index.html)
- **Created By**: Claude (Anthropic AI) using reverse engineering techniques

## Reverse Engineering Process

This clone was created by Claude using the following methodology:

### 1. Initial Reconnaissance

**WebFetch Analysis**: First, Claude visited the original ScrollBuddy.com website to understand:
- The overall design and layout
- Visual appearance of the scroll buddies
- User interaction patterns
- Feature set and functionality

### 2. Playwright Inspection

**Automated Browser Analysis**: Using Playwright, Claude:
- Loaded the original website in a headless browser
- Identified scroll-related DOM elements by searching for keywords (`scroll`, `buddy`, `walker`, `scuba`)
- Discovered two key JavaScript files: `sbv1.js` (walker) and `sb_scuba.js` (scuba diver)
- Captured the HTML structure and CSS styling
- Monitored element positions during scroll events

**Key Findings**:
```javascript
// Found elements:
<div id="s">...</div>              // Walker stick figure
<div id="scubaBuddy">...</div>     // Scuba diver
<button id="scuba-link">...</button> // Toggle button

// External scripts:
sbv1.js        // Walker animation logic
sb_scuba.js    // Scuba diver animation logic
```

### 3. Source Code Analysis

**JavaScript Extraction**: Claude downloaded and analyzed the original scripts:
- `sbv1.js` - Contained walker animation with minified code
- `sb_scuba.js` - Contained scuba animation with readable code

**Discovered Animation Mechanics**:
- **Phase-based animation**: Uses a `walkSpeed = 0.0314` multiplier
- **Sine wave calculations**: `Math.sin(phase) * degrees` for limb rotation
- **Vertical positioning**: Maps scroll percentage to viewport height
- **Direction detection**: Tracks scroll direction to flip characters
- **Transform-based rendering**: Uses CSS transforms for all animations

### 4. Understanding the Animation System

**Walker Animation Breakdown**:
```javascript
// Phase calculation
walkPhase += scrollDelta * 0.0314

// Arm movement
const upperArmAngle = Math.sin(phase) * 30
leftArm.transform = `rotate(${90 + upperArmAngle}deg)`
rightArm.transform = `rotate(${90 - upperArmAngle}deg)`

// Leg movement with asymmetry for natural gait
const baseUpperLegAngle = Math.sin(phase) * 25
const leftUpperLegAngle = baseUpperLegAngle < 0 ? baseUpperLegAngle * 1.5 : baseUpperLegAngle
```

**Scuba Diver Animation Breakdown**:
```javascript
// Swimming motion with fin movement
const getHipAngle = (phase) => {
    const angle = Math.sin(phase) * 30
    return angle > 0 ? angle : angle * 1.4  // Asymmetric down-stroke
}

// Fin flexing with phase offset
const leftFinFlexAngle = -Math.sign(hipAngle) * Math.abs(Math.sin(legPhase - Math.PI/6)) * 15
```

### 5. Reconstruction

**Clean Implementation**: Claude recreated the functionality with:
- **Modular design**: Separate files for walker, scuba, and main controller
- **Improved code structure**: More readable variable names and comments
- **Bug fixes**: Fixed style re-application when toggling between characters
- **Enhanced features**: Added proper toggle mechanism between the two buddies

### 6. Testing & Validation

**Automated Testing**: Created Playwright tests to verify:
- Walker loads and animates correctly
- Scuba diver loads and animates correctly
- Toggle functionality works bidirectionally
- Scroll position tracking is accurate
- CSS styles are properly applied and removed

**Test Results**: All tests passed successfully, confirming feature parity with the original.

### Technical Challenges Solved

1. **Style Persistence**: Initial implementation removed CSS styles when toggling but didn't recreate them. Fixed by moving style creation inside init functions.

2. **Multi-joint Animation**: Recreated complex kinematics for walker's arms, forearms, legs, lower legs, and feet with proper trigonometric calculations.

3. **Natural Movement**: Implemented asymmetric leg movement for realistic walking gait and asymmetric hip rotation for swimming motion.

4. **Accessibility**: Ensured `prefers-reduced-motion` support was properly implemented.

### Tools & Technologies Used in Reverse Engineering

- **Playwright**: Browser automation for inspecting the live website
- **WebFetch**: For retrieving and analyzing web content
- **curl**: For downloading JavaScript source files
- **Node.js**: For running analysis and test scripts
- **Claude Code**: AI-powered development environment for orchestrating the reverse engineering process

## Features

### Two Scroll Buddies

1. **Walker** - A stick figure that walks along the scrollbar
   - Natural walking animation with articulated limbs
   - Flips horizontally when scrolling up
   - Drag the walker to scroll the page
   - "Back to top" button

2. **Scuba Diver** - A diver that swims as you scroll
   - Swimming animation with fin movement
   - Flips vertically when scrolling down
   - Tank and diving mask details

### Animation Features

- **Smooth vertical movement** - Characters move along the scrollbar based on scroll percentage
- **Phase-based limb animation** - Uses sine wave calculations for natural movement
- **Direction awareness** - Characters flip when scrolling direction changes
- **Accessibility support** - Respects `prefers-reduced-motion` setting
- **Interactive drag** - Click and drag the walker to scroll the page
- **Touch support** - Works on mobile devices

## Technical Implementation

### Technologies Used

- Vanilla JavaScript (no dependencies)
- CSS3 transforms and animations
- HTML5

### How It Works

1. **Position Tracking**: Characters are positioned using CSS `fixed` positioning
2. **Scroll Percentage**: Vertical position is calculated as `scrollPercent * (windowHeight - buddyHeight)`
3. **Animation Phase**: Limb movement uses phase increments of `scrollDelta * 0.0314`
4. **Smooth Rendering**: Uses `requestAnimationFrame` for 60fps animation
5. **Transform-based Animation**: Limbs rotate using CSS transforms based on sine wave calculations

### File Structure

```
scroll-buddy/
├── index.html          # Main HTML page with content
├── styles.css          # Page styles
├── walker.js           # Walking stick figure implementation
├── scuba.js            # Scuba diver implementation
├── main.js             # Toggle controller between buddies
└── test-clone.js       # Playwright automated tests
```

## Getting Started

### Running Locally

1. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open your browser to:
   ```
   http://localhost:8080/index.html
   ```

3. Scroll and watch the buddy move!

4. Click the "Switch to Scuba Diver" button to toggle between characters

### Running Tests

```bash
npm install
npx playwright install chromium
node test-clone.js
```

## Animation Details

### Walker Animation

The walker uses a sophisticated multi-joint animation system:

- **Arms**: Swing in opposition with `Math.sin(phase) * 30` degrees
- **Forearms**: Additional articulation based on upper arm angle
- **Legs**: Move with `Math.sin(phase) * 25` degrees with asymmetry for natural gait
- **Lower legs**: Bend more when leg is forward
- **Feet**: Subtle rotation for ground contact

### Scuba Diver Animation

The scuba diver simulates swimming motion:

- **Hip rotation**: `Math.sin(phase) * 30` degrees with asymmetric down-stroke
- **Calf bending**: Depends on hip angle (35-45 degree range)
- **Fin flexing**: Phase-offset sine wave for realistic fin movement
- **Vertical flip**: Uses `scaleY(-1)` when scrolling down

## Browser Compatibility

Works in all modern browsers that support:
- CSS3 transforms
- requestAnimationFrame
- ES6 JavaScript

## Accessibility

- Respects `prefers-reduced-motion` media query
- Automatically hides animation for users with motion sensitivity
- Supports keyboard navigation

## Credits

Inspired by [ScrollBuddy.com](https://scrollbuddy.com/)

Built with vanilla JavaScript - no frameworks required!
