/**
 * Royal Birthday Web Application
 * Seamless Two-View Single Page Architecture:
 * - View 1: Centered Grand Heart-Leaf Tree, Love Blast Fireworks, Ambient Floating Hearts,
 *           Majestic Centered Typography, and Floating "For You ➔" Arrow Button.
 * - View 2: Royal Celebration Photo Showcase, Starry Night Sky Canvas, 3D Metallic Balloons,
 *           Typewriter Hero Message with Dedication Signature ("Noyal Saji"),
 *           and 3D Flipping Card 2 Friendship Letter ("Happy Birthday, Ziya ✨").
 */

(function() {
  'use strict';

  // ============================================================
  // PALETTES & CONFIGURATION
  // ============================================================
  const LEAF_PALETTE = [
    '#800020', // Burgundy Rich
    '#4A0404', // Burgundy Deep
    '#67001F', // Burgundy Rose
    '#DC143C', // Crimson
    '#E0115F', // Magenta
    '#FF1493', // Deep Pink
    '#FFB6C1', // Pastel Pink
    '#FFC0CB', // Soft Pink
    '#F4C2C2', // Baby Rose
    '#D4AF37', // Champagne Gold
    '#FFE87C', // Light Gold
    '#FFFFFF'  // Pure Star Dust Sparkle
  ];

  const BLAST_PALETTES = [
    ['#FF1493', '#FF69B4', '#FFB6C1', '#FFF0F5', '#FFE4E1'], // Rose Pink Burst
    ['#D4AF37', '#FFDF73', '#FFF8DC', '#FFB6C1', '#FFFFFF'], // Champagne Gold & Pink
    ['#DC143C', '#E0115F', '#FF1493', '#FFC0CB', '#FFFFFF'], // Crimson Ruby Spark
    ['#9370DB', '#BA55D3', '#FF69B4', '#F4C2C2', '#FFFFFF'], // Lavender Velvet Dream
    ['#FF6B8B', '#FF8E53', '#FFA07A', '#FFFDF0', '#FFFFFF']  // Sunset Coral Glow
  ];

  const luxuryBalloonPalettes = [
    {
      name: 'classic-burgundy',
      light: '#FFB8C6',
      mid: '#800020',
      dark: '#400010',
      deepShadow: '#1F0008',
      string: 'rgba(230, 80, 115, 0.55)'
    },
    {
      name: 'deep-velvet-merlot',
      light: '#FFCCD5',
      mid: '#720026',
      dark: '#360012',
      deepShadow: '#180007',
      string: 'rgba(230, 80, 115, 0.55)'
    },
    {
      name: 'crimson-burgundy',
      light: '#FFDEE2',
      mid: '#900C3F',
      dark: '#4A001A',
      deepShadow: '#22000B',
      string: 'rgba(230, 80, 115, 0.55)'
    },
    {
      name: 'rich-wine-burgundy',
      light: '#FFBAC8',
      mid: '#66001F',
      dark: '#2D000D',
      deepShadow: '#130005',
      string: 'rgba(230, 80, 115, 0.55)'
    },
    {
      name: 'ruby-red',
      light: '#FFAEB9',
      mid: '#D50000',
      dark: '#8B0000',
      deepShadow: '#400000',
      string: 'rgba(255, 60, 80, 0.55)'
    },
    {
      name: 'vibrant-rose-red',
      light: '#FFB6C1',
      mid: '#E0115F',
      dark: '#880E4F',
      deepShadow: '#380018',
      string: 'rgba(224, 17, 95, 0.55)'
    },
    {
      name: 'rose-gold',
      light: '#FFF0F3',
      mid: '#D98292',
      dark: '#70333D',
      deepShadow: '#38141B',
      string: 'rgba(217, 130, 146, 0.5)'
    },
    {
      name: 'soft-rose-pink',
      light: '#FFFFFF',
      mid: '#FF69B4',
      dark: '#C2185B',
      deepShadow: '#560027',
      string: 'rgba(255, 105, 180, 0.5)'
    },
    {
      name: 'royal-gold',
      light: '#FFF9D2',
      mid: '#D4AF37',
      dark: '#7A5C00',
      deepShadow: '#3D2D00',
      string: 'rgba(212, 175, 55, 0.5)'
    }
  ];

  let currentConfig = {
    name: "Fawziya",
    age: "",
    sender: "Noyal Saji",
    message: "May the days ahead bring you endless happiness, genuine love, peaceful moments, and beautiful adventures beyond your wildest dreams."
  };

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const treeView = document.getElementById('tree-view');
  const celebrationView = document.getElementById('celebration-view');

  // View 1 Elements
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startBtn');
  const birthdayGreeting = document.getElementById('birthdayGreeting');
  const arrowBtnContainer = document.getElementById('arrowBtnContainer');
  const arrowBtn = document.getElementById('arrowBtn');
  const treeCanvas = document.getElementById('mainCanvas');
  const treeCtx = treeCanvas.getContext('2d');

  // View 2 Elements
  const backToTreeBtn = document.getElementById('backToTreeBtn');
  const starsCanvas = document.getElementById('stars-canvas');
  const starsCtx = starsCanvas ? starsCanvas.getContext('2d') : null;
  const balloonContainer = document.getElementById('balloon-layer');

  // ============================================================
  // VIEW 1: STATE & ANIMATION LOGIC (TREE + LOVE BLAST)
  // ============================================================
  let treeWidth = 0;
  let treeHeight = 0;
  let treeDpr = 1;
  let treeAnimationStarted = false;
  let globalTime = 0;
  let currentActiveView = 'tree'; // 'tree' | 'celebration'

  let branches = [];
  let breezeParticles = [];
  let loveBlastRockets = [];
  let loveBlastParticles = [];
  let nextBlastTimer = 0.8;

  // Red Heart Seed State & Particles
  let seed = null;
  let seedRipples = [];
  let seedSparks = [];

  function resizeTreeCanvas() {
    treeDpr = Math.min(window.devicePixelRatio || 1, 2);
    treeWidth = window.innerWidth;
    treeHeight = window.innerHeight;

    treeCanvas.width = treeWidth * treeDpr;
    treeCanvas.height = treeHeight * treeDpr;
    treeCanvas.style.width = treeWidth + 'px';
    treeCanvas.style.height = treeHeight + 'px';

    treeCtx.setTransform(1, 0, 0, 1, 0, 0);
    treeCtx.scale(treeDpr, treeDpr);
  }

  // Draw Heart on Canvas
  function drawHeart(c, x, y, size, color, alpha, rotation = 0) {
    c.save();
    c.translate(x, y);
    if (rotation !== 0) c.rotate(rotation);
    const s = size / 16;
    c.scale(s, s);
    c.fillStyle = color;
    c.globalAlpha = Math.max(0, Math.min(1, alpha));
    c.beginPath();
    c.moveTo(0, -6);
    c.bezierCurveTo(-3, -16, -16, -16, -16, -2);
    c.bezierCurveTo(-16, 7, -3, 15, 0, 19);
    c.bezierCurveTo(3, 15, 16, 7, 16, -2);
    c.bezierCurveTo(16, -16, 3, -16, 0, -6);
    c.closePath();
    c.fill();
    c.restore();
  }

  // Draw Radiant 3D Red Heart Seed
  function drawHeartSeed(c, x, y, size, alpha, pulse = 1, rotation = 0) {
    c.save();
    c.translate(x, y);
    if (rotation !== 0) c.rotate(rotation);
    const s = (size * pulse) / 16;
    c.scale(s, s);

    // Glowing ruby-red halo
    c.shadowColor = 'rgba(255, 23, 68, 0.8)';
    c.shadowBlur = 10 * pulse;

    // Rich 3D ruby gradient
    const grad = c.createLinearGradient(-10, -16, 12, 18);
    grad.addColorStop(0, '#FF5277');
    grad.addColorStop(0.35, '#FF1744');
    grad.addColorStop(0.7, '#D50000');
    grad.addColorStop(1, '#6A0017');

    c.fillStyle = grad;
    c.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Crisp Heart Path
    c.beginPath();
    c.moveTo(0, -6);
    c.bezierCurveTo(-3, -16, -16, -16, -16, -2);
    c.bezierCurveTo(-16, 7, -3, 15, 0, 19);
    c.bezierCurveTo(3, 15, 16, 7, 16, -2);
    c.bezierCurveTo(16, -16, 3, -16, 0, -6);
    c.closePath();
    c.fill();

    // Elegant golden accent rim outline for sharp heart definition
    c.strokeStyle = 'rgba(255, 225, 130, 0.85)';
    c.lineWidth = 1.0;
    c.stroke();

    // Glossy glass specular shine on the upper lobe
    c.beginPath();
    c.ellipse(-7, -7, 4.8, 2.4, -Math.PI / 4, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255, 255, 255, 0.65)';
    c.shadowColor = 'transparent';
    c.shadowBlur = 0;
    c.fill();

    c.restore();
  }

  // Draw 4-point Sparkle Star
  function drawSparkle(c, x, y, radius, color, alpha, rotation = 0) {
    c.save();
    c.translate(x, y);
    c.rotate(rotation);
    c.fillStyle = color;
    c.globalAlpha = Math.max(0, Math.min(1, alpha));
    c.beginPath();
    for (let i = 0; i < 4; i++) {
      c.lineTo(Math.cos((i * Math.PI) / 2) * radius, Math.sin((i * Math.PI) / 2) * radius);
      c.lineTo(
        Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.25),
        Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.25)
      );
    }
    c.closePath();
    c.fill();
    c.restore();
  }

  // Love Blast Explosion Engine
  function createLoveBlast(targetX, targetY) {
    const palette = BLAST_PALETTES[Math.floor(Math.random() * BLAST_PALETTES.length)];
    const totalHearts = 26 + Math.floor(Math.random() * 12);

    for (let i = 0; i < totalHearts; i++) {
      const t = (i / totalHearts) * (Math.PI * 2);
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const speed = (2.2 + Math.random() * 2.8);
      const vx = (hx / 16) * speed;
      const vy = (hy / 16) * speed;

      loveBlastParticles.push({
        x: targetX,
        y: targetY,
        vx: vx,
        vy: vy,
        size: 5 + Math.random() * 6.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.014,
        friction: 0.965,
        gravity: 0.045,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        isHeart: Math.random() < 0.82
      });
    }

    const starCount = 18 + Math.floor(Math.random() * 12);
    for (let j = 0; j < starCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 4.5;
      loveBlastParticles.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.018 + Math.random() * 0.02,
        friction: 0.95,
        gravity: 0.04,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        isHeart: false
      });
    }
  }

  function launchLoveRocket() {
    const isMobile = treeWidth < 768;
    const startX = (0.15 + Math.random() * 0.7) * treeWidth;
    const startY = treeHeight + 10;
    const targetX = startX + (Math.random() - 0.5) * (treeWidth * 0.25);
    const targetY = (isMobile ? 0.18 + Math.random() * 0.35 : 0.12 + Math.random() * 0.38) * treeHeight;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 11 + Math.random() * 4;
    const duration = dist / speed;

    loveBlastRockets.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      color: '#FFB6C1',
      life: 0,
      maxLife: duration
    });
  }

  // Branch Class for Centered Tree
  class Branch {
    constructor(startX, startY, length, angle, depth, maxDepth, branchWidth) {
      this.startX = startX;
      this.startY = startY;
      this.length = length;
      this.angle = angle;
      this.depth = depth;
      this.maxDepth = maxDepth;
      this.branchWidth = branchWidth;
      
      this.endX = startX + Math.cos(angle) * length;
      this.endY = startY + Math.sin(angle) * length;

      this.currentProgress = 0;
      this.growSpeed = 0.024 + Math.random() * 0.012;
      this.finished = false;
      this.children = [];
      this.spawnedChildren = false;
      this.leaves = [];

      this.setupLeaves();
    }

    setupLeaves() {
      if (this.depth < 2) return;

      const stemLeavesCount = this.depth >= 3 ? 4 : 2;
      for (let i = 0; i < stemLeavesCount; i++) {
        const t = 0.3 + (i / stemLeavesCount) * 0.62;
        const side = (i % 2 === 0 ? 1 : -1);
        const leafAngle = this.angle + side * (0.65 + Math.random() * 0.45);
        const dist = 6 + Math.random() * 13;

        this.leaves.push({
          t: t,
          dist: dist,
          angleOffset: leafAngle,
          size: 6.5 + Math.random() * 7.5,
          currentSize: 0,
          color: LEAF_PALETTE[Math.floor(Math.random() * LEAF_PALETTE.length)],
          targetAlpha: 0.88 + Math.random() * 0.12,
          alpha: 0,
          rotation: leafAngle + Math.PI / 2,
          seed: Math.random() * 100,
          floatSpeed: 0.8 + Math.random() * 1.4,
          isSparkle: Math.random() < 0.18
        });
      }

      if (this.depth >= this.maxDepth - 1) {
        const tipCount = 6 + Math.floor(Math.random() * 5);
        for (let j = 0; j < tipCount; j++) {
          const spread = ((j - tipCount / 2) / tipCount) * 1.9;
          const leafAngle = this.angle + spread + (Math.random() - 0.5) * 0.35;
          const dist = 8 + Math.random() * 20;

          this.leaves.push({
            t: 1.0,
            dist: dist,
            angleOffset: leafAngle,
            size: 7.5 + Math.random() * 8.5,
            currentSize: 0,
            color: LEAF_PALETTE[Math.floor(Math.random() * LEAF_PALETTE.length)],
            targetAlpha: 0.92 + Math.random() * 0.08,
            alpha: 0,
            rotation: leafAngle + Math.PI / 2,
            seed: Math.random() * 100,
            floatSpeed: 0.8 + Math.random() * 1.4,
            isSparkle: Math.random() < 0.25
          });
        }
      }
    }

    update() {
      if (this.currentProgress < 1) {
        this.currentProgress += this.growSpeed;
        if (this.currentProgress >= 1) {
          this.currentProgress = 1;
          this.finished = true;
          this.spawnNextBranches();
        }
      }

      for (let leaf of this.leaves) {
        if (this.currentProgress >= leaf.t) {
          leaf.currentSize += (leaf.size - leaf.currentSize) * 0.08;
          leaf.alpha += (leaf.targetAlpha - leaf.alpha) * 0.08;
        }
      }

      for (let child of this.children) {
        child.update();
      }
    }

    draw(c, time) {
      const currX = this.startX + Math.cos(this.angle) * (this.length * this.currentProgress);
      const currY = this.startY + Math.sin(this.angle) * (this.length * this.currentProgress);

      c.save();
      c.beginPath();
      c.moveTo(this.startX, this.startY);
      c.lineTo(currX, currY);

      const progressFactor = this.depth / this.maxDepth;
      const r = Math.round(78 + progressFactor * 160);
      const g = Math.round(22 + progressFactor * 120);
      const b = Math.round(38 + progressFactor * 140);
      c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.9 - progressFactor * 0.1})`;
      c.lineWidth = Math.max(1.3, this.branchWidth * (1 - (this.currentProgress * 0.12)));
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.shadowColor = 'rgba(224, 17, 95, 0.3)';
      c.shadowBlur = 9;
      c.stroke();
      c.restore();

      for (let leaf of this.leaves) {
        if (leaf.currentSize > 0.1) {
          const attachX = this.startX + Math.cos(this.angle) * (this.length * leaf.t);
          const attachY = this.startY + Math.sin(this.angle) * (this.length * leaf.t);

          const sway = Math.sin(time * leaf.floatSpeed + leaf.seed) * 0.18;
          const finalAngle = leaf.angleOffset + sway;
          const leafX = attachX + Math.cos(finalAngle) * leaf.dist;
          const leafY = attachY + Math.sin(finalAngle) * leaf.dist;

          c.save();
          c.beginPath();
          c.moveTo(attachX, attachY);
          c.lineTo(leafX, leafY);
          c.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.58)`;
          c.lineWidth = 1;
          c.stroke();
          c.restore();

          if (leaf.isSparkle) {
            drawSparkle(c, leafX, leafY, leaf.currentSize * 0.9, leaf.color, leaf.alpha, time * 2 + leaf.seed);
          } else {
            drawHeart(c, leafX, leafY, leaf.currentSize, leaf.color, leaf.alpha, leaf.rotation + sway);
          }
        }
      }

      for (let child of this.children) {
        child.draw(c, time);
      }
    }

    spawnNextBranches() {
      if (this.spawnedChildren || this.depth >= this.maxDepth) return;
      this.spawnedChildren = true;

      const numBranches = this.depth === 0 ? 3 : (Math.random() < 0.45 ? 3 : 2);
      const angleSpread = this.depth === 0 ? 0.48 : (0.44 + Math.random() * 0.22);
      const lengthReduction = this.depth === 0 ? 0.77 : (0.71 + Math.random() * 0.08);

      for (let i = 0; i < numBranches; i++) {
        let childAngle;
        if (numBranches === 3) {
          const offsets = [-angleSpread, 0, angleSpread];
          childAngle = this.angle + offsets[i] * (0.85 + Math.random() * 0.3);
        } else {
          childAngle = this.angle + (i === 0 ? -angleSpread : angleSpread) * (0.8 + Math.random() * 0.4);
        }

        const childLength = this.length * lengthReduction;
        const childWidth = Math.max(1.2, this.branchWidth * 0.71);

        const child = new Branch(
          this.endX,
          this.endY,
          childLength,
          childAngle,
          this.depth + 1,
          this.maxDepth,
          childWidth
        );
        this.children.push(child);
      }
    }
  }

  let treeFullyGrown = false;

  function isTreeCompletelyGrown() {
    if (branches.length === 0) return false;
    function checkBranch(b) {
      if (!b.finished) return false;
      for (let child of b.children) {
        if (!checkBranch(child)) return false;
      }
      return true;
    }
    return branches.every(checkBranch) && branches[0].children.length > 0;
  }

  function initTree() {
    treeFullyGrown = false;
    branches = [];
    breezeParticles = [];
    loveBlastRockets = [];
    loveBlastParticles = [];

    const isMobile = treeWidth < 768;
    const rootX = seed ? seed.targetX : treeWidth * 0.5;
    const rootY = seed ? seed.targetY + 8 : treeHeight + 10;
    const initialLength = isMobile ? treeHeight * 0.155 : treeHeight * 0.185;
    const initialAngle = -Math.PI / 2;
    const maxDepth = isMobile ? 6 : 7;
    const trunkWidth = isMobile ? 15 : 20;

    const trunk = new Branch(rootX, rootY, initialLength, initialAngle, 0, maxDepth, trunkWidth);
    branches.push(trunk);
  }

  function spawnBreezeParticle() {
    if (!treeAnimationStarted || branches.length === 0) return;

    const centerX = treeWidth * 0.5;
    const centerY = treeHeight * 0.6;

    breezeParticles.push({
      x: centerX + (Math.random() - 0.5) * (treeWidth * 0.65),
      y: centerY + (Math.random() - 0.5) * 160,
      vx: (Math.random() - 0.5) * 2.0,
      vy: 0.3 + Math.random() * 1.0,
      size: 4 + Math.random() * 6.5,
      color: LEAF_PALETTE[Math.floor(Math.random() * LEAF_PALETTE.length)],
      alpha: 0.85,
      decay: 0.003 + Math.random() * 0.005,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      isHeart: Math.random() < 0.75,
      swaySpeed: 1 + Math.random() * 2,
      seed: Math.random() * 100
    });
  }

  // Tree Render Loop
  let lastTreeTimestamp = 0;
  let breezeTimer = 0;

  function renderTree(timestamp) {
    if (!lastTreeTimestamp) lastTreeTimestamp = timestamp;
    const dt = Math.min((timestamp - lastTreeTimestamp) / 1000, 0.1);
    lastTreeTimestamp = timestamp;
    globalTime += dt;
    breezeTimer += dt;

    if (currentActiveView === 'tree') {
      treeCtx.clearRect(0, 0, treeWidth, treeHeight);

      if (treeAnimationStarted) {
        // 1. Process Falling / Planted Seed
        if (seed) {
          if (!seed.planted) {
            seed.progress += dt / seed.duration;
            if (seed.progress >= 1) {
              seed.progress = 1;
              seed.planted = true;
              seed.x = seed.targetX;
              seed.y = seed.targetY;

              // Ripple shockwave on the ground
              seedRipples.push(
                { x: seed.targetX, y: seed.targetY, r: 2, maxR: 75, alpha: 1, color: '#FF1744' },
                { x: seed.targetX, y: seed.targetY, r: 2, maxR: 120, alpha: 0.85, color: '#D4AF37' }
              );

              // Sparkle burst around planted seed
              for (let i = 0; i < 32; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 1.2 + Math.random() * 4.0;
                seedSparks.push({
                  x: seed.targetX,
                  y: seed.targetY,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd - 1.4,
                  size: 3 + Math.random() * 4.5,
                  color: ['#FF1744', '#FF4081', '#D4AF37', '#FFFDF0', '#FFB6C1'][Math.floor(Math.random() * 5)],
                  alpha: 1,
                  decay: 0.022 + Math.random() * 0.02,
                  isHeart: Math.random() < 0.5
                });
              }

              // Tree sprouts and grows upwards immediately out of the seed!
              initTree();

              // Scheduled fireworks and greeting displays
              setTimeout(() => {
                createLoveBlast(treeWidth * 0.25, treeHeight * 0.28);
                createLoveBlast(treeWidth * 0.75, treeHeight * 0.28);
              }, 900);

              setTimeout(() => {
                birthdayGreeting.classList.remove('hidden');
                birthdayGreeting.classList.add('visible');

                // Stardust bursts across the title as letters blossom
                for (let k = 0; k < 12; k++) {
                  setTimeout(() => {
                    const sparkX = treeWidth * 0.5 + (Math.random() - 0.5) * Math.min(treeWidth * 0.7, 420);
                    const sparkY = treeHeight * 0.08 + (Math.random() - 0.5) * 35;
                    for (let s = 0; s < 3; s++) {
                      seedSparks.push({
                        x: sparkX,
                        y: sparkY,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: -0.4 - Math.random() * 1.2,
                        size: 2.5 + Math.random() * 3.5,
                        color: ['#D4AF37', '#FFFDF0', '#FFDF73', '#FFB6C1'][Math.floor(Math.random() * 4)],
                        alpha: 1,
                        decay: 0.025 + Math.random() * 0.02,
                        isHeart: false
                      });
                    }
                  }, k * 85);
                }
              }, 1700);

              setTimeout(() => {
                arrowBtnContainer.classList.remove('hidden');
                arrowBtnContainer.classList.add('visible');
              }, 2900);
            } else {
              // Smooth, gentle descending motion with graceful floating sway
              const easeT = Math.pow(seed.progress, 1.35);
              const sway = Math.sin(seed.progress * Math.PI * 4) * (26 * Math.sin(seed.progress * Math.PI));
              seed.x = seed.startX + (seed.targetX - seed.startX) * seed.progress + sway;
              seed.y = seed.startY + (seed.targetY - seed.startY) * easeT;

              // Stardust and mini glowing heart trail behind the descending heart
              seed.trailTimer += dt;
              if (seed.trailTimer > 0.028) {
                seed.trailTimer = 0;
                seedSparks.push({
                  x: seed.x + (Math.random() - 0.5) * 8,
                  y: seed.y + (Math.random() - 0.5) * 8,
                  vx: (Math.random() - 0.5) * 0.7,
                  vy: -0.3 - Math.random() * 0.9,
                  size: 3.5 + Math.random() * 4.5,
                  color: ['#FF1744', '#FF4081', '#FFD700', '#FFFDF0', '#FF80AB'][Math.floor(Math.random() * 5)],
                  alpha: 0.95,
                  decay: 0.022 + Math.random() * 0.018,
                  isHeart: Math.random() < 0.55
                });
              }
            }
          }
        }

        // 2. Render Ground Ripples
        for (let i = seedRipples.length - 1; i >= 0; i--) {
          const rip = seedRipples[i];
          rip.r += 70 * dt;
          rip.alpha -= 0.85 * dt;
          if (rip.alpha <= 0 || rip.r >= rip.maxR) {
            seedRipples.splice(i, 1);
          } else {
            treeCtx.save();
            treeCtx.beginPath();
            treeCtx.ellipse(rip.x, rip.y, rip.r, rip.r * 0.35, 0, 0, Math.PI * 2);
            treeCtx.strokeStyle = rip.color;
            treeCtx.globalAlpha = Math.max(0, rip.alpha);
            treeCtx.lineWidth = 2.5 * rip.alpha;
            treeCtx.shadowColor = rip.color;
            treeCtx.shadowBlur = 12;
            treeCtx.stroke();
            treeCtx.restore();
          }
        }

        // 3. Render Seed Sparkles & Trail
        treeCtx.save();
        treeCtx.globalCompositeOperation = 'lighter';
        for (let i = seedSparks.length - 1; i >= 0; i--) {
          const sp = seedSparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.decay;
          if (sp.alpha <= 0) {
            seedSparks.splice(i, 1);
          } else {
            if (sp.isHeart) {
              drawHeart(treeCtx, sp.x, sp.y, sp.size, sp.color, sp.alpha);
            } else {
              drawSparkle(treeCtx, sp.x, sp.y, sp.size, sp.color, sp.alpha);
            }
          }
        }
        treeCtx.restore();

        // 4. Render Glowing Red Heart Seed
        if (seed) {
          const seedPulse = seed.planted ? (1 + Math.sin(globalTime * 4.5) * 0.14) : (1 + Math.sin(globalTime * 6) * 0.09);
          const seedRot = seed.planted ? 0 : Math.cos(seed.progress * Math.PI * 4) * 0.22;
          drawHeartSeed(treeCtx, seed.x, seed.y, seed.size, seed.alpha, seedPulse, seedRot);
        }

        // 5. Love Blast Fireworks (when tree is active)
        if (branches.length > 0) {
          nextBlastTimer -= dt;
          if (nextBlastTimer <= 0) {
            launchLoveRocket();
            nextBlastTimer = 1.3 + Math.random() * 1.6;
          }
        }

        // Rockets
        for (let i = loveBlastRockets.length - 1; i >= 0; i--) {
          const r = loveBlastRockets[i];
          r.x += r.vx;
          r.y += r.vy;
          r.life++;

          drawSparkle(treeCtx, r.x, r.y, 3, '#FFFDF0', 0.9, globalTime * 5);
          if (Math.random() < 0.4) {
            loveBlastParticles.push({
              x: r.x + (Math.random() - 0.5) * 4,
              y: r.y + (Math.random() - 0.5) * 4,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8 + 0.8,
              size: 2 + Math.random() * 2.5,
              color: '#FFB6C1',
              alpha: 0.8,
              decay: 0.035,
              friction: 0.98,
              gravity: 0.02,
              rotation: 0,
              rotSpeed: 0,
              isHeart: false
            });
          }

          if (r.life >= r.maxLife || r.y <= r.targetY) {
            createLoveBlast(r.targetX, r.targetY);
            loveBlastRockets.splice(i, 1);
          }
        }

        // Fireworks Sparks
        treeCtx.save();
        treeCtx.globalCompositeOperation = 'lighter';
        for (let i = loveBlastParticles.length - 1; i >= 0; i--) {
          const p = loveBlastParticles[i];
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.rotation += p.rotSpeed;

          if (p.alpha <= 0) {
            loveBlastParticles.splice(i, 1);
          } else {
            if (p.isHeart) {
              drawHeart(treeCtx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
            } else {
              drawSparkle(treeCtx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
            }
          }
        }
        treeCtx.restore();

        // Branches & Leaves
        for (let b of branches) {
          b.update();
          b.draw(treeCtx, globalTime);
        }

        // Ambient Breeze
        if (branches.length > 0) {
          if (breezeTimer > 0.22) {
            breezeTimer = 0;
            if (breezeParticles.length < 45) {
              spawnBreezeParticle();
            }
          }

          for (let i = breezeParticles.length - 1; i >= 0; i--) {
            const bp = breezeParticles[i];
            bp.x += bp.vx;
            bp.y += bp.vy + Math.sin(globalTime * bp.swaySpeed + bp.seed) * 0.5;
            bp.alpha -= bp.decay;
            bp.rotation += bp.rotSpeed;

            if (bp.alpha <= 0 || bp.x < -50 || bp.x > treeWidth + 50 || bp.y > treeHeight + 50) {
              breezeParticles.splice(i, 1);
            } else {
              if (bp.isHeart) {
                drawHeart(treeCtx, bp.x, bp.y, bp.size, bp.color, bp.alpha, bp.rotation);
              } else {
                drawSparkle(treeCtx, bp.x, bp.y, bp.size, bp.color, bp.alpha, bp.rotation);
              }
            }
          }
        }
      }
    }

    requestAnimationFrame(renderTree);
  }


  // ============================================================
  // VIEW 2: ROYAL CELEBRATION LOGIC (TYPEWRITER, BALLOONS, STARS)
  // ============================================================

  // Typewriter Engine
  function typeWriterText(element, text, speed = 26) {
    return new Promise((resolve) => {
      let index = 0;
      element.innerHTML = '';
      
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      element.appendChild(cursor);

      let isCompleted = false;

      function finishImmediately() {
        if (isCompleted) return;
        isCompleted = true;
        element.textContent = text;
        if (cursor.parentNode) cursor.remove();
        resolve();
      }

      element.addEventListener('click', finishImmediately, { once: true });

      function typeNextChar() {
        if (isCompleted) return;
        if (index < text.length) {
          const char = text.charAt(index);
          cursor.insertAdjacentText('beforebegin', char);
          index++;

          let delay = speed;
          if (char === '.' || char === '!' || char === '?') {
            delay = speed + 240;
          } else if (char === ',' || char === '—' || char === ';') {
            delay = speed + 110;
          } else if (Math.random() < 0.1) {
            delay = speed + 30;
          }

          setTimeout(typeNextChar, delay);
        } else {
          isCompleted = true;
          setTimeout(() => {
            if (cursor.parentNode) cursor.remove();
            resolve();
          }, 300);
        }
      }

      typeNextChar();
    });
  }

  // Main Wish & Signature Typewriter Engine
  let mainWishStarted = false;
  async function startMainWishTypewriter() {
    if (mainWishStarted) return;
    mainWishStarted = true;
    const msgEl = document.getElementById('display-message');
    if (msgEl) {
      await typeWriterText(msgEl, `"${currentConfig.message}"`, 28);
    }

    await new Promise(r => setTimeout(r, 350));

    const sigBox = document.getElementById('sender-signature-box');
    const loveLabel = document.getElementById('display-love-label');
    const senderEl = document.getElementById('display-sender');

    if (sigBox) {
      sigBox.classList.remove('opacity-0');
    }

    if (loveLabel) {
      await typeWriterText(loveLabel, "With lots of love,", 20);
    }

    await new Promise(r => setTimeout(r, 180));

    if (senderEl) {
      senderEl.classList.add('shimmer-text-sweep');
      await typeWriterText(senderEl, `~ ${currentConfig.sender}`, 30);
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 80,
        origin: { y: 0.62 },
        colors: ['#FFF6D5', '#D4AF37', '#800020', '#FFFFFF', '#B76E79']
      });
    }
  }

  // Luxury Golden Confetti Burst
  function triggerLuxuryConfetti() {
    if (typeof confetti === 'function') {
      const goldColors = ['#FFF6D5', '#D4AF37', '#AA820A', '#F5DEB3', '#FFFFFF', '#F4DE7C', '#B76E79'];
      
      confetti({
        particleCount: window.innerWidth < 640 ? 50 : 85,
        spread: 70,
        origin: { y: 0.65 },
        colors: goldColors,
        ticks: 220,
        gravity: 0.85
      });

      setTimeout(() => {
        confetti({
          particleCount: window.innerWidth < 640 ? 25 : 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.05, y: 0.7 },
          colors: goldColors
        });
        confetti({
          particleCount: window.innerWidth < 640 ? 25 : 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.95, y: 0.7 },
          colors: goldColors
        });
      }, 180);
    }
  }

  // Floating Metallic Heart Balloons
  let balloonCounter = 0;
  function spawnLuxuryBalloon() {
    if (!balloonContainer || currentActiveView !== 'celebration') return;

    const balloon = document.createElement('div');
    balloon.className = 'luxury-balloon';
    
    const palette = luxuryBalloonPalettes[Math.floor(Math.random() * luxuryBalloonPalettes.length)];
    const randomLeft = Math.random() * 84 + 6;
    const randomDuration = Math.random() * 6 + 9;
    const isMobile = window.innerWidth < 640;
    const randomSize = isMobile ? (Math.random() * 12 + 38) : (Math.random() * 18 + 48);
    const uniqueId = `heart-balloon-${Date.now()}-${++balloonCounter}`;

    balloon.style.left = `${randomLeft}%`;
    balloon.style.animationDuration = `${randomDuration}s`;

    balloon.innerHTML = `
      <div class="relative flex flex-col items-center">
        <svg viewBox="0 0 100 130" style="width: ${randomSize}px; height: ${randomSize * 1.3}px; overflow: visible;" class="drop-shadow-lg">
          <defs>
            <radialGradient id="grad-${uniqueId}" cx="35%" cy="30%" r="65%" fx="28%" fy="24%">
              <stop offset="0%" stop-color="${palette.light}" />
              <stop offset="35%" stop-color="${palette.mid}" />
              <stop offset="85%" stop-color="${palette.dark}" />
              <stop offset="100%" stop-color="${palette.deepShadow}" />
            </radialGradient>
            <linearGradient id="shine-${uniqueId}" x1="0%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75" />
              <stop offset="40%" stop-color="#ffffff" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M 50,84 C 20,58 3,38 3,23 C 3,9.5 14,1.5 28.5,1.5 C 38,1.5 45.5,6.5 50,13 C 54.5,6.5 62,1.5 71.5,1.5 C 86,1.5 97,9.5 97,23 C 97,38 80,58 50,84 Z" fill="url(#grad-${uniqueId})" />
          <path d="M 28.5,4 C 16,4 6,11.5 6,23 C 6,34 18,50 40,68 C 30,55 20,40 20,28 C 20,18 24,10 32,7 Z" fill="#ffffff" opacity="0.18" />
          <ellipse cx="28" cy="20" rx="12" ry="7" transform="rotate(-30 28 20)" fill="url(#shine-${uniqueId})" />
          <circle cx="21" cy="15" r="3" fill="#ffffff" opacity="0.75" />
          <polygon points="50,83 44,91 56,91" fill="${palette.mid}" />
          <ellipse cx="50" cy="85" rx="3.5" ry="2" fill="${palette.dark}" />
          <path d="M 50,91 Q 46,102 54,113 T 49,128" stroke="${palette.string}" stroke-width="1.8" fill="none" stroke-linecap="round" />
        </svg>
      </div>
    `;

    function popBalloon(e) {
      e.stopPropagation();
      e.preventDefault();
      if (typeof confetti === 'function') {
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
        confetti({
          particleCount: 18,
          colors: ['#FFF6D5', '#D4AF37', '#800020', '#900C3F', '#B76E79', '#FFFFFF', '#A855F7'],
          startVelocity: 15,
          spread: 360,
          origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight }
        });
      }
      balloon.remove();
    }

    balloon.addEventListener('click', popBalloon);
    balloon.addEventListener('touchstart', popBalloon, { passive: false });

    balloonContainer.appendChild(balloon);

    setTimeout(() => {
      if (balloon.parentNode) balloon.remove();
    }, randomDuration * 1000);
  }

  function spawnMultipleBalloons(count = 3) {
    for (let i = 0; i < count; i++) {
      setTimeout(spawnLuxuryBalloon, i * 200);
    }
  }

  setInterval(() => {
    if (currentActiveView === 'celebration') {
      const maxBalloons = window.innerWidth < 640 ? 4 : 6;
      if (document.querySelectorAll('.luxury-balloon').length < maxBalloons) {
        spawnLuxuryBalloon();
      }
    }
  }, 3200);

  // Starry Sky Canvas Particle Background (View 2)
  // Starry Sky & Golden Floating Embers Canvas Background (View 2)
  let stars = [];
  let goldenEmbers = [];
  let shootingStars = [];
  let lastShootingStarTime = 0;

  const starColors = [
    '255, 253, 240', // Champagne Gold
    '255, 223, 115', // Warm Gold
    '255, 240, 245', // Soft Rose White
    '255, 255, 255', // Pure Diamond White
    '244, 222, 124'  // Luminous Gold
  ];

  function resizeStarsCanvas() {
    if (!starsCanvas || !starsCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    starsCanvas.width = window.innerWidth * dpr;
    starsCanvas.height = window.innerHeight * dpr;
    starsCtx.setTransform(1, 0, 0, 1, 0, 0);
    starsCtx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    goldenEmbers = [];
    shootingStars = [];
    const isMobile = window.innerWidth < 640;
    const densityDivider = isMobile ? 16000 : 10000;
    const numStars = Math.floor((window.innerWidth * window.innerHeight) / densityDivider);

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.35,
        alpha: Math.random() * 0.75 + 0.25,
        speed: Math.random() * 0.015 + 0.005,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    // Golden Floating Embers / Fireflies
    const numEmbers = isMobile ? 18 : 32;
    for (let i = 0; i < numEmbers; i++) {
      goldenEmbers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.6 + 0.25,
        vy: -(Math.random() * 0.35 + 0.15),
        swingFreq: Math.random() * 0.02 + 0.01,
        swingAmp: Math.random() * 25 + 10,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function spawnShootingStar() {
    if (shootingStars.length >= 2) return;
    const startX = Math.random() * (window.innerWidth * 0.7);
    const startY = Math.random() * (window.innerHeight * 0.35);
    const length = Math.random() * 80 + 70;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25; // ~45 degrees downward
    const speed = Math.random() * 4.5 + 4.0;

    shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.018 + 0.012
    });
  }

  function animateStars() {
    if (currentActiveView === 'celebration' && starsCtx) {
      starsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Render Twinkling Stars
      stars.forEach(star => {
        star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        if (star.alpha < 0.15) star.alpha = 0.15;
        if (star.alpha > 0.9) star.alpha = 0.9;

        starsCtx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starsCtx.fill();

        star.y -= star.speed;
        if (star.y < 0) {
          star.y = window.innerHeight;
          star.x = Math.random() * window.innerWidth;
        }
      });

      // Render Floating Golden Embers with Soft Glow
      goldenEmbers.forEach(ember => {
        ember.y += ember.vy;
        ember.x = ember.baseX + Math.sin(Date.now() * ember.swingFreq) * ember.swingAmp;
        
        const pulse = 0.7 + 0.3 * Math.sin(Date.now() * ember.pulseSpeed + ember.pulseOffset);
        const currentAlpha = ember.alpha * pulse;

        // Soft outer glow
        const glowGrad = starsCtx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.radius * 3.5);
        glowGrad.addColorStop(0, `rgba(255, 223, 115, ${currentAlpha * 0.8})`);
        glowGrad.addColorStop(0.5, `rgba(212, 175, 55, ${currentAlpha * 0.3})`);
        glowGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        starsCtx.fillStyle = glowGrad;
        starsCtx.beginPath();
        starsCtx.arc(ember.x, ember.y, ember.radius * 3.5, 0, Math.PI * 2);
        starsCtx.fill();

        // Core dot
        starsCtx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
        starsCtx.beginPath();
        starsCtx.arc(ember.x, ember.y, ember.radius * 0.6, 0, Math.PI * 2);
        starsCtx.fill();

        if (ember.y < -20) {
          ember.y = window.innerHeight + 20;
          ember.baseX = Math.random() * window.innerWidth;
          ember.x = ember.baseX;
        }
      });

      // Periodic Shooting Stars (Every 4 - 8 seconds)
      const now = Date.now();
      if (now - lastShootingStarTime > 5500 && Math.random() < 0.03) {
        spawnShootingStar();
        lastShootingStarTime = now;
      }

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

        const starGrad = starsCtx.createLinearGradient(s.x, s.y, tailX, tailY);
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        starGrad.addColorStop(0.3, `rgba(255, 223, 115, ${s.alpha * 0.8})`);
        starGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        starsCtx.strokeStyle = starGrad;
        starsCtx.lineWidth = 1.8;
        starsCtx.lineCap = 'round';
        starsCtx.beginPath();
        starsCtx.moveTo(s.x, s.y);
        starsCtx.lineTo(tailX, tailY);
        starsCtx.stroke();
      }
    }
    requestAnimationFrame(animateStars);
  }


  // ============================================================
  // PAGE 2: BALLOON CANOPY COVER & RELEASE BUTTON ENGINE
  // ============================================================
  let isTransitioning = false;
  let canopyReleased = false;

  function initBalloonCanopy() {
    const canopyCover = document.getElementById('balloonCanopyCover');
    const container = document.getElementById('canopyBalloonsContainer');
    const btnWrapper = document.getElementById('releaseBtnWrapper');
    if (!canopyCover || !container) return;

    canopyReleased = false;
    resetReleasePrompt();
    container.innerHTML = '';
    canopyCover.classList.remove('hidden');
    if (btnWrapper) {
      btnWrapper.classList.remove('fade-out');
    }

    const isMobile = window.innerWidth < 640;
    const numRows = isMobile ? 13 : 11;
    const numCols = isMobile ? 9 : 15;
    const rowSpacing = 115 / numRows;
    const colSpacing = 115 / numCols;
    const transitionPalettes = luxuryBalloonPalettes.filter(p => p.name !== 'royal-gold');

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const balloon = document.createElement('div');
        const idleType = ((r + c) % 3) + 1;
        balloon.className = `canopy-balloon idle-${idleType}`;

        // Staggered honeycomb offset
        const staggerX = (r % 2 === 0) ? (colSpacing * 0.45) : 0;
        const posX = (-8 + c * colSpacing + staggerX + (Math.random() - 0.5) * (colSpacing * 0.35)).toFixed(1);
        const posY = (-8 + r * rowSpacing + (Math.random() - 0.5) * (rowSpacing * 0.3)).toFixed(1);

        const baseSize = isMobile ? (72 + Math.random() * 24) : (98 + Math.random() * 36);
        const rot = (-18 + Math.random() * 36).toFixed(1);
        const zIdx = 10 + Math.floor(Math.random() * 30);

        balloon.style.left = `${posX}%`;
        balloon.style.top = `${posY}%`;
        balloon.style.zIndex = zIdx;
        balloon.style.setProperty('--rot', `${rot}deg`);

        // Soaring flight parameters
        const drift1 = (-28 + Math.random() * 56).toFixed(1);
        const drift2 = (-36 + Math.random() * 72).toFixed(1);
        const drift3 = (-28 + Math.random() * 56).toFixed(1);
        const drift4 = (-20 + Math.random() * 40).toFixed(1);
        const duration = (4.8 + Math.random() * 1.5).toFixed(2);
        const delay = ((numRows - 1 - r) * 0.12 + Math.random() * 0.25).toFixed(2);

        balloon.style.setProperty('--drift-1', `${drift1}px`);
        balloon.style.setProperty('--drift-2', `${drift2}px`);
        balloon.style.setProperty('--drift-3', `${drift3}px`);
        balloon.style.setProperty('--drift-4', `${drift4}px`);
        balloon.style.setProperty('--dur', `${duration}s`);
        balloon.style.setProperty('--del', `${delay}s`);

        const palette = transitionPalettes[Math.floor(Math.random() * transitionPalettes.length)];
        const uniqueId = `canopy-b-${r}-${c}-${Date.now()}`;

        balloon.innerHTML = `
          <svg viewBox="0 0 100 130" style="width: ${baseSize}px; height: ${baseSize * 1.3}px; overflow: visible;">
            <defs>
              <radialGradient id="cgrad-${uniqueId}" cx="35%" cy="30%" r="65%" fx="28%" fy="24%">
                <stop offset="0%" stop-color="${palette.light}" />
                <stop offset="35%" stop-color="${palette.mid}" />
                <stop offset="85%" stop-color="${palette.dark}" />
                <stop offset="100%" stop-color="${palette.deepShadow}" />
              </radialGradient>
              <linearGradient id="cshine-${uniqueId}" x1="0%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.82" />
                <stop offset="40%" stop-color="#ffffff" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path d="M 50,84 C 20,58 3,38 3,23 C 3,9.5 14,1.5 28.5,1.5 C 38,1.5 45.5,6.5 50,13 C 54.5,6.5 62,1.5 71.5,1.5 C 86,1.5 97,9.5 97,23 C 97,38 80,58 50,84 Z" fill="url(#cgrad-${uniqueId})" />
            <path d="M 28.5,4 C 16,4 6,11.5 6,23 C 6,34 18,50 40,68 C 30,55 20,40 20,28 C 20,18 24,10 32,7 Z" fill="#ffffff" opacity="0.2" />
            <ellipse cx="28" cy="20" rx="12" ry="7" transform="rotate(-30 28 20)" fill="url(#cshine-${uniqueId})" />
            <circle cx="21" cy="15" r="3" fill="#ffffff" opacity="0.8" />
            <polygon points="50,83 44,91 56,91" fill="${palette.mid}" />
            <ellipse cx="50" cy="85" rx="3.5" ry="2" fill="${palette.dark}" />
            <path d="M 50,91 Q 46,102 54,113 T 49,128" stroke="${palette.string}" stroke-width="1.8" fill="none" stroke-linecap="round" />
          </svg>
        `;

        fragment.appendChild(balloon);
      }
    }

    container.appendChild(fragment);
  }

  function releaseBalloonCanopy() {
    if (canopyReleased) return;
    canopyReleased = true;

    const canopyCover = document.getElementById('balloonCanopyCover');
    const btnWrapper = document.getElementById('releaseBtnWrapper');
    const balloons = document.querySelectorAll('.canopy-balloon');

    if (btnWrapper) {
      btnWrapper.classList.add('fade-out');
    }

    // Sparkle confetti burst at button click
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 25,
        spread: 80,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FFF6D5', '#D4AF37', '#FF1493', '#800020', '#FFFFFF']
      });
    }

    // Trigger upward soaring on every balloon
    balloons.forEach((b, idx) => {
      const soarType = (idx % 3) + 1;
      b.classList.remove('idle-1', 'idle-2', 'idle-3');
      b.classList.add(`soaring-${soarType}`);
    });

    // As balloons soar and clear the card, start typewriter and celebration confetti
    setTimeout(() => {
      triggerLuxuryConfetti();
      spawnMultipleBalloons(3);
      startMainWishTypewriter();
    }, 1200);

    // Hide canopy cover when flight finishes (~7.5s)
    setTimeout(() => {
      if (canopyCover) {
        canopyCover.classList.add('hidden');
      }
    }, 7500);
  }

  function switchToCelebrationView() {
    if (isTransitioning || currentActiveView === 'celebration') return;
    isTransitioning = true;
    currentActiveView = 'celebration';

    treeView.classList.remove('active');
    treeView.classList.add('hidden');

    celebrationView.classList.remove('hidden');
    celebrationView.classList.add('active');
    celebrationView.style.opacity = '1';

    window.scrollTo({ top: 0, behavior: 'instant' });
    resizeStarsCanvas();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // Initialize the dense balloon wall on Page 2 with the "Release The Balloons 💕" button
    initBalloonCanopy();

    isTransitioning = false;
  }

  function switchToTreeView() {
    if (isTransitioning || currentActiveView === 'tree') return;
    isTransitioning = true;
    currentActiveView = 'tree';

    celebrationView.classList.remove('active');
    celebrationView.classList.add('hidden');

    treeView.classList.remove('hidden');
    treeView.classList.add('active');
    treeView.style.opacity = '1';

    resizeTreeCanvas();
    isTransitioning = false;
  }

  // Navigation & Release Event Listeners
  let noClickCount = 0;
  const noPhrases = [
    'No 😢',
    'Are you sure? 🥺',
    'Think again! 💔',
    'Please? 🌸',
    'Last chance! 😭'
  ];

  function resetReleasePrompt() {
    noClickCount = 0;
    const yesBtn = document.getElementById('releaseYesBtn');
    const noBtn = document.getElementById('releaseNoBtn');

    if (yesBtn) {
      yesBtn.style.transform = '';
      yesBtn.style.setProperty('--target-scale', '1');
      yesBtn.classList.remove('btn-bounce-pop');
      yesBtn.innerHTML = '<span class="choice-btn-icon">✓</span> <span>Yes</span>';
    }

    if (noBtn) {
      noBtn.style.display = 'inline-flex';
      noBtn.style.opacity = '1';
      noBtn.style.transform = '';
      noBtn.style.pointerEvents = 'auto';
      noBtn.style.width = '';
      noBtn.style.padding = '';
      noBtn.style.margin = '';
      noBtn.style.border = '';
      noBtn.innerHTML = '<span class="choice-btn-icon">✕</span> <span>No</span>';
    }
  }

  const releaseYesBtn = document.getElementById('releaseYesBtn');
  if (releaseYesBtn) {
    const handleYes = (e) => {
      e.stopPropagation();
      releaseBalloonCanopy();
    };
    releaseYesBtn.addEventListener('click', handleYes);
    releaseYesBtn.addEventListener('touchstart', handleYes, { passive: true });
  }

  const releaseNoBtn = document.getElementById('releaseNoBtn');
  if (releaseNoBtn) {
    const handleNo = (e) => {
      e.stopPropagation();
      noClickCount++;

      const yesBtn = document.getElementById('releaseYesBtn');
      const maxClicks = 5;

      const yesScale = (1 + (noClickCount * 0.28)).toFixed(2);
      const noScale = Math.max(0, 1 - (noClickCount * 0.18)).toFixed(2);

      if (yesBtn) {
        yesBtn.style.setProperty('--target-scale', `${yesScale}`);
        yesBtn.style.transform = `scale(${yesScale})`;
        yesBtn.classList.remove('btn-bounce-pop');
        void yesBtn.offsetWidth;
        yesBtn.classList.add('btn-bounce-pop');

        if (noClickCount >= 2) {
          yesBtn.innerHTML = '<span class="choice-btn-icon">✓</span> <span>Yes! 💕</span>';
        }
      }

      if (noClickCount < maxClicks) {
        releaseNoBtn.style.transform = `scale(${noScale})`;
        const phrase = noPhrases[Math.min(noClickCount - 1, noPhrases.length - 1)];
        releaseNoBtn.innerHTML = `<span>${phrase}</span>`;
      } else {
        // Disappear No Button
        releaseNoBtn.style.opacity = '0';
        releaseNoBtn.style.transform = 'scale(0)';
        releaseNoBtn.style.pointerEvents = 'none';
        releaseNoBtn.style.width = '0px';
        releaseNoBtn.style.padding = '0px';
        releaseNoBtn.style.margin = '0px';
        releaseNoBtn.style.border = 'none';
        setTimeout(() => {
          releaseNoBtn.style.display = 'none';
        }, 350);
      }
    };
    releaseNoBtn.addEventListener('click', handleNo);
    releaseNoBtn.addEventListener('touchstart', handleNo, { passive: true });
  }

  if (arrowBtn) {
    arrowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchToCelebrationView();
    });
  }

  if (backToTreeBtn) {
    backToTreeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchToTreeView();
    });
  }

  // Interactive Clicks on Tree View / Celebration View
  window.addEventListener('pointerdown', (e) => {
    if (currentActiveView === 'tree') {
      if (!treeAnimationStarted) return;
      if (e.target.closest('#arrowBtn') || e.target.closest('#startBtn')) return;
      createLoveBlast(e.clientX, e.clientY);
    } else if (currentActiveView === 'celebration') {
      if (e.target.closest('#backToTreeBtn') || e.target.closest('.luxury-balloon') || e.target.closest('#moments-story-section') || e.target.closest('#photoLightboxModal')) return;
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 10,
          startVelocity: 10,
          spread: 60,
          colors: ['#FFF6D5', '#D4AF37', '#FFFFFF'],
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight
          }
        });
      }
    }
  });

  // ============================================================
  // ROYAL 3D COVERFLOW PERSPECTIVE GALLERY CONTROLLER
  // ============================================================
  let currentCoverflowIndex = 0;
  const coverflowCards = document.querySelectorAll('.coverflow-card');
  const coverflowDots = document.querySelectorAll('#coverflowDots .album-dot');
  const coverflowPrevBtn = document.getElementById('coverflowPrevBtn');
  const coverflowNextBtn = document.getElementById('coverflowNextBtn');
  const coverflowStage = document.getElementById('coverflowStage');
  let coverflowAutoPlayTimer = null;

  function updateCoverflow() {
    if (!coverflowCards || coverflowCards.length === 0) return;
    const total = coverflowCards.length;
    const isMobile = window.innerWidth < 640;

    coverflowCards.forEach((card, i) => {
      // Calculate shortest signed distance around the circle
      let diff = i - currentCoverflowIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      card.classList.remove('active');

      if (diff === 0) {
        // Center Active Card
        card.classList.add('active');
        card.style.transform = `translateX(0px) translateZ(0px) rotateY(0deg) scale(1)`;
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.zIndex = '10';
        card.style.pointerEvents = 'auto';
      } else if (diff === 1) {
        // Immediate Right
        const tx = isMobile ? 85 : 140;
        card.style.transform = `translateX(${tx}px) translateZ(-110px) rotateY(-32deg) scale(0.82)`;
        card.style.opacity = '0.72';
        card.style.filter = 'brightness(0.75)';
        card.style.zIndex = '6';
        card.style.pointerEvents = 'auto';
      } else if (diff === -1) {
        // Immediate Left
        const tx = isMobile ? -85 : -140;
        card.style.transform = `translateX(${tx}px) translateZ(-110px) rotateY(32deg) scale(0.82)`;
        card.style.opacity = '0.72';
        card.style.filter = 'brightness(0.75)';
        card.style.zIndex = '6';
        card.style.pointerEvents = 'auto';
      } else if (diff === 2) {
        // Far Right
        const tx = isMobile ? 145 : 240;
        card.style.transform = `translateX(${tx}px) translateZ(-220px) rotateY(-48deg) scale(0.68)`;
        card.style.opacity = '0.38';
        card.style.filter = 'brightness(0.55)';
        card.style.zIndex = '3';
        card.style.pointerEvents = 'auto';
      } else if (diff === -2) {
        // Far Left
        const tx = isMobile ? -145 : -240;
        card.style.transform = `translateX(${tx}px) translateZ(-220px) rotateY(48deg) scale(0.68)`;
        card.style.opacity = '0.38';
        card.style.filter = 'brightness(0.55)';
        card.style.zIndex = '3';
        card.style.pointerEvents = 'auto';
      } else {
        // Hidden / Behind
        card.style.transform = `translateX(0px) translateZ(-350px) scale(0.5)`;
        card.style.opacity = '0';
        card.style.filter = 'brightness(0.3)';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    coverflowDots.forEach((dot, i) => {
      if (i === currentCoverflowIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function setCoverflowIndex(index) {
    if (!coverflowCards || coverflowCards.length === 0) return;
    const total = coverflowCards.length;
    currentCoverflowIndex = (index + total) % total;
    updateCoverflow();
  }

  function startCoverflowAutoPlay() {
    stopCoverflowAutoPlay();
    coverflowAutoPlayTimer = setInterval(() => {
      setCoverflowIndex(currentCoverflowIndex + 1);
    }, 3800); // 3.8s smooth auto-advance
  }

  function stopCoverflowAutoPlay() {
    if (coverflowAutoPlayTimer) {
      clearInterval(coverflowAutoPlayTimer);
      coverflowAutoPlayTimer = null;
    }
  }

  if (coverflowPrevBtn) {
    coverflowPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCoverflowIndex(currentCoverflowIndex - 1);
      startCoverflowAutoPlay();
    });
  }

  if (coverflowNextBtn) {
    coverflowNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setCoverflowIndex(currentCoverflowIndex + 1);
      startCoverflowAutoPlay();
    });
  }

  coverflowDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      setCoverflowIndex(idx);
      startCoverflowAutoPlay();
    });
  });

  // Click on cards: Side cards navigate to center, active center card opens lightbox
  coverflowCards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === currentCoverflowIndex) {
        // Active center card: Open Lightbox
        const fullSrc = card.getAttribute('data-full-src') || card.querySelector('img')?.src || 'photo1.jpg';
        openPhotoLightbox(fullSrc);
      } else {
        // Side card: Bring to center
        setCoverflowIndex(i);
        startCoverflowAutoPlay();
      }
    });
  });

  // Touch Swipe Gesture for Coverflow on Mobile
  if (coverflowStage) {
    let touchStartX = 0;
    let touchEndX = 0;

    coverflowStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopCoverflowAutoPlay();
    }, { passive: true });

    coverflowStage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 35) {
        if (diffX > 0) {
          setCoverflowIndex(currentCoverflowIndex + 1);
        } else {
          setCoverflowIndex(currentCoverflowIndex - 1);
        }
      }
      startCoverflowAutoPlay();
    }, { passive: true });

    coverflowStage.addEventListener('mouseenter', stopCoverflowAutoPlay);
    coverflowStage.addEventListener('mouseleave', startCoverflowAutoPlay);
  }

  // Lightbox Modal Controller (Clean, No annoying quotes)
  const photoLightboxModal = document.getElementById('photoLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openPhotoLightbox(src) {
    if (!photoLightboxModal) return;
    if (lightboxImg) lightboxImg.src = src;
    photoLightboxModal.classList.remove('hidden');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 26,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#D4AF37', '#FFFDF0', '#FFB6C1', '#FF1493', '#FFFFFF']
      });
    }
  }

  function closePhotoLightbox() {
    if (!photoLightboxModal) return;
    photoLightboxModal.classList.add('hidden');
  }

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePhotoLightbox();
    });
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closePhotoLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoLightboxModal && !photoLightboxModal.classList.contains('hidden')) {
      closePhotoLightbox();
    }
  });

  // 3D Parallax Tilt & Dynamic Specular Glare for Luxury Glass Cards
  const luxuryCards = document.querySelectorAll('.luxury-glass');
  if (window.matchMedia('(hover: hover)').matches) {
    luxuryCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Subtle realistic 3D tilt angles (max 3.5 degrees)
        const rotateX = (((y - centerY) / centerY) * -3.5).toFixed(2);
        const rotateY = (((x - centerX) / centerX) * 3.5).toFixed(2);
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        
        // Specular glare reflection percentage
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--glare-x', '50%');
        card.style.setProperty('--glare-y', '0%');
      });
    });
  }

  // Initialize Coverflow state and auto-play
  updateCoverflow();
  startCoverflowAutoPlay();

  // Start Screen Click: Spawns Glowing Red Heart Seed from Button
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (treeAnimationStarted) return;
      treeAnimationStarted = true;

      const btnRect = startBtn.getBoundingClientRect();
      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      const isMobile = treeWidth < 768;
      const targetX = treeWidth * 0.5;
      const targetY = treeHeight - (isMobile ? 12 : 18);

      seed = {
        startX: startX,
        startY: startY,
        targetX: targetX,
        targetY: targetY,
        x: startX,
        y: startY,
        progress: 0,
        duration: 2.85, // Smooth slow graceful descent (~2.85s)
        size: isMobile ? 12 : 15, // Cute, delicate small heart seed
        planted: false,
        pulse: 1,
        alpha: 1,
        trailTimer: 0
      };

      // Sparkles at the button click point
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1.0 + Math.random() * 3.5;
        seedSparks.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 3.0 + Math.random() * 4.0,
          color: ['#FF1744', '#FF4081', '#FFD700', '#FFFDF0', '#FF80AB'][Math.floor(Math.random() * 5)],
          alpha: 1,
          decay: 0.024 + Math.random() * 0.02,
          isHeart: Math.random() < 0.5
        });
      }

      startScreen.classList.add('fade-out');
    });
  }

  // ============================================================
  // ROYAL BIRTHDAY GIFT SURPRISE & PRANK INTERACTION
  // ============================================================
  const giftStage1 = document.getElementById('giftStage1');
  const giftStage2 = document.getElementById('giftStage2');
  const giftStageNoResponse = document.getElementById('giftStageNoResponse');
  const giftStageWishInput = document.getElementById('giftStageWishInput');
  const giftStageLetterAnim = document.getElementById('giftStageLetterAnim');
  const giftStageSuccess = document.getElementById('giftStageSuccess');

  const letterEnvelope3D = document.getElementById('letterEnvelope3D');
  const parchmentLetter = document.getElementById('parchmentLetter');
  const parchmentWishText = document.getElementById('parchmentWishText');
  const envelopeTopFlap = document.getElementById('envelopeTopFlap');
  const waxSealStamp = document.getElementById('waxSealStamp');
  const waxSealShockwave = document.getElementById('waxSealShockwave');
  const letterAnimStatusText = document.getElementById('letterAnimStatusText');

  const giftYesBtn1 = document.getElementById('giftYesBtn1');
  const giftNoBtn1 = document.getElementById('giftNoBtn1');

  const giftYesBtn2 = document.getElementById('giftYesBtn2');
  const giftNoBtn2 = document.getElementById('giftNoBtn2');
  const giftGoToWishBtn = document.getElementById('giftGoToWishBtn');

  const giftWishInput = document.getElementById('giftWishInput');
  const giftSubmitBtn = document.getElementById('giftSubmitBtn');
  const giftSavedWishText = document.getElementById('giftSavedWishText');
  const giftEditWishBtn = document.getElementById('giftEditWishBtn');

  function showGiftStage(targetStage) {
    const allStages = [giftStage1, giftStage2, giftStageNoResponse, giftStageWishInput, giftStageLetterAnim, giftStageSuccess];
    allStages.forEach(stage => {
      if (stage) {
        if (stage === targetStage) {
          stage.classList.remove('hidden');
          stage.classList.add('flex');
          stage.style.opacity = '0';
          stage.style.transform = 'translateY(12px) scale(0.98)';
          requestAnimationFrame(() => {
            stage.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            stage.style.opacity = '1';
            stage.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          stage.classList.add('hidden');
          stage.classList.remove('flex');
        }
      }
    });
  }

  // Load saved wish if exists
  const savedWish = localStorage.getItem('fawziya_birthday_wish');
  if (savedWish && giftSavedWishText) {
    giftSavedWishText.textContent = `"${savedWish}"`;
  }

  // STAGE 1: Prank "Yes" Click -> "No" grows on clicks 1 & 2, and auto-clicks on click 3!
  let yesClickCount = 0;
  let isPrankRunning = false;
  if (giftYesBtn1 && giftNoBtn1) {
    giftYesBtn1.addEventListener('click', () => {
      if (isPrankRunning) return;
      yesClickCount++;

      if (yesClickCount === 1) {
        // Click 1: No grows bigger, Yes shrinks slightly
        giftNoBtn1.style.transform = 'scale(1.35)';
        giftYesBtn1.style.transform = 'scale(0.9)';
      } else if (yesClickCount === 2) {
        // Click 2: No grows even bigger with golden glow, Yes shrinks more
        giftNoBtn1.classList.add('btn-grow-huge');
        giftNoBtn1.style.transform = 'scale(1.65)';
        giftYesBtn1.style.transform = 'scale(0.78)';
        if (typeof confetti === 'function') {
          const rect = giftNoBtn1.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 15,
            spread: 35,
            origin: { x, y },
            colors: ['#D4AF37', '#FF1744', '#FFF8DC']
          });
        }
      } else if (yesClickCount >= 3) {
        // Click 3: No takes over completely and auto-clicks!
        isPrankRunning = true;
        giftYesBtn1.classList.add('btn-shrink-away');
        giftNoBtn1.style.transform = 'scale(1.95)';

        if (typeof confetti === 'function') {
          const rect = giftNoBtn1.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 35,
            spread: 55,
            origin: { x, y },
            colors: ['#D4AF37', '#FF1744', '#FFF8DC']
          });
        }

        setTimeout(() => {
          showGiftStage(giftStage2);
          isPrankRunning = false;
          yesClickCount = 0;
          giftYesBtn1.classList.remove('btn-shrink-away');
          giftYesBtn1.style.transform = '';
          giftNoBtn1.classList.remove('btn-grow-huge');
          giftNoBtn1.style.transform = '';
        }, 700);
      }
    });

    // If user clicks "No" directly on Stage 1
    giftNoBtn1.addEventListener('click', () => {
      if (isPrankRunning) return;
      showGiftStage(giftStage2);
    });
  }

  // STAGE 2: "Ohh How Sweet" Popup Stage
  if (giftYesBtn2) {
    giftYesBtn2.addEventListener('click', () => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#FF1744', '#FF4081', '#D4AF37', '#FFFDF0']
        });
      }
      showGiftStage(giftStageWishInput);
    });
  }

  if (giftNoBtn2) {
    giftNoBtn2.addEventListener('click', () => {
      // User clicked "No" on stage 2 -> "Ethavana pattikkilla!"
      showGiftStage(giftStageNoResponse);
    });
  }

  if (giftGoToWishBtn) {
    giftGoToWishBtn.addEventListener('click', () => {
      showGiftStage(giftStageWishInput);
    });
  }

  // STAGE 4: Dynamic Gift Option Chips Loader & Interactive Selection
  const defaultGiftList = [
    { id: 'teddy', label: 'Teddy', emoji: '🧸' },
    { id: 'ferrero', label: 'Ferrero Rocher', emoji: '🍫' },
    { id: 'bubble_tea', label: 'Bubble Tea', emoji: '🧋' },
    { id: 'ice_cream', label: 'Ice Cream', emoji: '🍨' },
    { id: 'pastry', label: 'Pastry', emoji: '🧁' },
    { id: 'book', label: 'Book', emoji: '📚' },
    { id: 'lipstick', label: 'Lipstick', emoji: '💄' }
  ];

  function attachChipEventListener(chip) {
    chip.addEventListener('click', () => {
      const giftType = chip.getAttribute('data-gift');
      if (giftType === 'custom') {
        chip.classList.toggle('selected');
        if (giftWishInput) {
          giftWishInput.focus();
        }
      } else {
        chip.classList.toggle('selected');
      }

      // Little sparkling pop on chip selection
      if (typeof confetti === 'function' && chip.classList.contains('selected')) {
        const rect = chip.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 15,
          spread: 35,
          origin: { x, y },
          colors: ['#FF1744', '#D4AF37', '#FFFDF0']
        });
      }
    });
  }

  async function loadDynamicGiftOptions() {
    const chipsContainer = document.getElementById('giftOptionChips');
    if (!chipsContainer) return;

    let gifts = defaultGiftList;
    try {
      const res = await fetch('/api/gifts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          gifts = data;
          localStorage.setItem('birthday_gift_options_cache', JSON.stringify(gifts));
        }
      }
    } catch (e) {
      console.warn('Using cached or default gifts:', e);
      try {
        const cached = localStorage.getItem('birthday_gift_options_cache');
        if (cached) gifts = JSON.parse(cached);
      } catch (err) {}
    }

    chipsContainer.innerHTML = '';
    gifts.forEach(gift => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gift-option-chip';
      const fullLabel = `${gift.label} ${gift.emoji}`;
      btn.setAttribute('data-gift', fullLabel);
      btn.innerHTML = `<span>${gift.emoji || '🎁'}</span><span>${gift.label}</span>`;
      attachChipEventListener(btn);
      chipsContainer.appendChild(btn);
    });

    // Append Custom Wish Button
    const customBtn = document.createElement('button');
    customBtn.type = 'button';
    customBtn.id = 'giftCustomOptionChip';
    customBtn.className = 'gift-option-chip';
    customBtn.setAttribute('data-gift', 'custom');
    customBtn.innerHTML = `<span>✍️</span><span>Njan Parayaam... 💌</span>`;
    attachChipEventListener(customBtn);
    chipsContainer.appendChild(customBtn);
  }

  loadDynamicGiftOptions();

  // =========================================================
  // SUPABASE DATABASE INTEGRATION FOR BIRTHDAY WISHES
  // =========================================================
  const SUPABASE_CONFIG = {
    url: 'https://glngacqixzgjnivlkptk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbmdhY3FpeHpnam5pdmxrcHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTU3MDQsImV4cCI6MjEwNDYzMTcwNH0.mEsjNv2A1ROKw_6Ry8hHBe0IFr426MQWIjUYp8WnhP8'
  };

  let supabaseClient = null;
  function getSupabaseClient() {
    if (!supabaseClient && typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      if (SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('YOUR_PROJECT_ID') && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.anonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
        try {
          supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        } catch (e) {
          console.warn('Supabase init warning:', e);
        }
      }
    }
    return supabaseClient;
  }

  async function saveWishToSupabase(fullWish, selectedGifts, customMessage) {
    const client = getSupabaseClient();
    if (!client) {
      console.log('ℹ️ Supabase keys not set yet. Wish safely recorded in localStorage.');
      return;
    }
    try {
      const { data, error } = await client
        .from('birthday_wishes')
        .insert([
          {
            recipient_name: 'Fawziya',
            selected_gift: selectedGifts.length > 0 ? selectedGifts.join(', ') : 'None',
            custom_wish: customMessage || 'None',
            full_wish: fullWish,
            device_info: `${navigator.userAgent}`
          }
        ]);
      if (error) {
        console.error('❌ Supabase Save Error:', error);
      } else {
        console.log('✅ Wish successfully saved to Supabase! 💌✨', data);
      }
    } catch (err) {
      console.error('❌ Supabase Network Error:', err);
    }
  }

  if (giftSubmitBtn && giftWishInput) {
    giftSubmitBtn.addEventListener('click', () => {
      const selectedChips = Array.from(document.querySelectorAll('.gift-option-chip.selected'))
        .map(c => c.getAttribute('data-gift'))
        .filter(g => g !== 'custom');
      
      const customWish = giftWishInput.value.trim();

      if (selectedChips.length === 0 && !customWish) {
        const chipsContainer = document.getElementById('giftOptionChips');
        if (chipsContainer) {
          chipsContainer.classList.add('animate-pulse');
          setTimeout(() => chipsContainer.classList.remove('animate-pulse'), 1000);
        }
        giftWishInput.focus();
        giftWishInput.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => giftWishInput.classList.remove('ring-2', 'ring-rose-500'), 1200);
        return;
      }

      let fullWishSummary = '';
      if (selectedChips.length > 0 && customWish) {
        fullWishSummary = `${selectedChips.join(', ')} + "${customWish}"`;
      } else if (selectedChips.length > 0) {
        fullWishSummary = selectedChips.join(', ');
      } else {
        fullWishSummary = customWish;
      }

      // Save wish to local storage
      localStorage.setItem('fawziya_birthday_wish', fullWishSummary);
      if (giftSavedWishText) {
        giftSavedWishText.textContent = `"${fullWishSummary}"`;
      }

      // Save wish to Supabase Database
      saveWishToSupabase(fullWishSummary, selectedChips, customWish);

      // Prepare Parchment Content
      if (parchmentWishText) {
        parchmentWishText.textContent = fullWishSummary;
      }

      // Reset Letter Animation Classes
      if (parchmentLetter) parchmentLetter.classList.remove('slid-inside');
      if (envelopeTopFlap) envelopeTopFlap.classList.remove('flap-closed');
      if (waxSealStamp) waxSealStamp.classList.remove('stamped');
      if (waxSealShockwave) waxSealShockwave.classList.remove('shockwave-active');
      if (letterEnvelope3D) {
        letterEnvelope3D.classList.remove('fly-away-sky');
        letterEnvelope3D.style.transform = '';
      }

      // Show Letter Animation Stage
      showGiftStage(giftStageLetterAnim);
      if (letterAnimStatusText) {
        letterAnimStatusText.textContent = "Writing your birthday wish... 📜✨";
      }

      // 1. Parchment slides into the envelope
      setTimeout(() => {
        if (parchmentLetter) parchmentLetter.classList.add('slid-inside');
        if (letterAnimStatusText) letterAnimStatusText.textContent = "Folding your wish into the envelope... 💌";
      }, 750);

      // 2. Envelope top flap folds down
      setTimeout(() => {
        if (envelopeTopFlap) envelopeTopFlap.classList.add('flap-closed');
        if (letterAnimStatusText) letterAnimStatusText.textContent = "Sealing with Wax Stamp... 💌✨";
      }, 1650);

      // 3. Wax seal stamps down with shockwave
      setTimeout(() => {
        if (waxSealStamp) waxSealStamp.classList.add('stamped');
        if (waxSealShockwave) waxSealShockwave.classList.add('shockwave-active');
        if (letterAnimStatusText) letterAnimStatusText.textContent = "Sealed with Birthday Wish! 💌💖✨";

        if (typeof confetti === 'function' && waxSealStamp) {
          const rect = waxSealStamp.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { x, y },
            colors: ['#FF1744', '#D4AF37', '#FFFDF0', '#FF4081']
          });
        }
      }, 2350);

      // 4. Envelope floats & flies into the starry sky
      setTimeout(() => {
        if (letterEnvelope3D) letterEnvelope3D.classList.add('fly-away-sky');
        if (letterAnimStatusText) letterAnimStatusText.textContent = "Sending birthday wish to the stars... 🚀✨";

        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 20,
                spread: 40,
                origin: { x: 0.55 + (i * 0.05), y: 0.5 - (i * 0.12) },
                colors: ['#D4AF37', '#FFDF73', '#FFFDF0', '#FF80AB']
              });
            }
          }, i * 250);
        }
      }, 3100);

      // 5. Grand Confetti & Reveal Success Stage
      setTimeout(() => {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#FF1744', '#FF4081', '#FFD700', '#FFFDF0', '#FF80AB']
          });
        }
        showGiftStage(giftStageSuccess);
      }, 4400);

    });
  }

  // Edit Wish Handler
  if (giftEditWishBtn && giftWishInput) {
    giftEditWishBtn.addEventListener('click', () => {
      showGiftStage(giftStageWishInput);
      if (giftWishInput) {
        giftWishInput.focus();
      }
    });
  }

  // Window Resize
  function handleResize() {
    if (currentActiveView === 'tree') {
      resizeTreeCanvas();
    } else {
      resizeStarsCanvas();
    }
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Initialize on Load
  resizeTreeCanvas();
  requestAnimationFrame(renderTree);
  requestAnimationFrame(animateStars);

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

})();
