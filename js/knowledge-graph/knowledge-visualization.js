// ANSH ASSOCIATES - Knowledge Graph Visualization
// Three.js-based knowledge graph showing connections between real estate concepts
//
// ── STATUS: OPTIONAL, NOT LOADED ──────────────────────────────────────
// This module is intentionally not imported by js/main.js. As committed
// it could not run, and importing it took the whole site down with it:
//
//   * It imports the bare specifiers 'three' and
//     'three/examples/jsm/controls/OrbitControls.js'. There is no build
//     step, no node_modules and no <script type="importmap"> in
//     index.html, so the browser cannot resolve them. Because js/main.js
//     imported this file statically, that single unresolvable specifier
//     prevented main.js from evaluating at all.
//   * index.html contains no #knowledge-graph container, so
//     initKnowledgeGraph() returns on its first line regardless.
//
// To enable it: add three.js via an import map, add a
// <div id="knowledge-graph"> to the page, and re-add the import to
// js/main.js behind a dynamic import() so a failure here can never
// block the rest of the page again.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initKnowledgeGraph(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Default options
    const settings = Object.assign({
        backgroundColor: 0xfffdf8, // Very light cream
        nodeColor: 0x8B0000, // ANSH Associates deep red
        connectionColor: 0xCD5C5C, // Lighter red for connections
        nodeSize: 14,
        connectionSize: 2,
        cameraDistance: 80,
        animationSpeed: 0.5
    }, options);

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = settings.cameraDistance;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add orbit controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Define knowledge nodes (real estate concepts)
    const nodes = [
        { id: 1, name: "Luxury Properties", group: "property-types", x: -20, y: 15, z: 0 },
        { id: 2, name: "Commercial Spaces", group: "property-types", x: 20, y: 15, z: 0 },
        { id: 3, name: "Investment Opportunities", group: "property-types", x: 0, y: 25, z: 0 },
        { id: 4, name: "ANSH Associates", group: "company", x: 0, y: 0, z: 0 },
        { id: 5, name: "Trust & Integrity", group: "values", x: -15, y: -15, z: 0 },
        { id: 6, name: "Expert Guidance", group: "services", x: 15, y: -15, z: 0 },
        { id: 7, name: "Market Analysis", group: "services", x: 0, y: -20, z: 0 },
        { id: 8, name: "Client Satisfaction", group: "values", x: -25, y: 0, z: 0 },
        { id: 9, name: "Innovation", group: "values", x: 25, y: 0, z: 0 },
        { id: 10, name: "Property Management", group: "services", x: 0, y: -10, z: 10 }
    ];

    // Define connections between nodes
    const connections = [
        { from: 1, to: 4 }, // Luxury Properties -> ANSH Associates
        { from: 2, to: 4 }, // Commercial Spaces -> ANSH Associates
        { from: 3, to: 4 }, // Investment Opportunities -> ANSH Associates
        { from: 4, to: 5 }, // ANSH Associates -> Trust & Integrity
        { from: 4, to: 6 }, // ANSH Associates -> Expert Guidance
        { from: 4, to: 7 }, // ANSH Associates -> Market Analysis
        { from: 5, to: 8 }, // Trust & Integrity -> Client Satisfaction
        { from: 9, to: 3 }, // Innovation -> Investment Opportunities
        { from: 6, to: 1 }, // Expert Guidance -> Luxury Properties
        { from: 6, to: 2 }, // Expert Guidance -> Commercial Spaces
        { from: 7, to: 3 }, // Market Analysis -> Investment Opportunities
        { from: 8, to: 4 }, // Client Satisfaction -> ANSH Associates
        { from: 10, to: 4 } // Property Management -> ANSH Associates
    ];

    // Create nodes as spheres
    const nodeMeshes = {};
    nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(settings.nodeSize, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: settings.nodeColor,
            metalness: 0.2,
            roughness: 0.4,
            emissive: settings.nodeColor,
            emissiveIntensity: 0.2
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(node.x, node.y, node.z);
        sphere.userData = node; // Store node data for interaction
        scene.add(sphere);
        nodeMeshes[node.id] = sphere;

        // Add label
        const label = makeTextSprite(node.name, { fontsize: 16, borderColor: { r: 0, g: 0, b: 0, a: 0.0 }, backgroundColor: { r: 255, g: 255, b: 255, a: 0.0 } });
        label.position.set(node.x, node.y + settings.nodeSize + 5, node.z);
        scene.add(label);
        node.labelSprite = label;
    });

    // Create connections as lines
    const connectionMeshes = [];
    connections.forEach(conn => {
        const startNode = nodes.find(n => n.id === conn.from);
        const endNode = nodes.find(n => n.id === conn.to);

        if (startNode && endNode) {
            const material = new THREE.LineBasicMaterial({
                color: settings.connectionColor,
                transparent: true,
                opacity: 0.6
            });

            const points = [
                new THREE.Vector3(startNode.x, startNode.y, startNode.z),
                new THREE.Vector3(endNode.x, endNode.y, endNode.z)
            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connectionMeshes.push(line);
        }
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Add point light for node glow
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    scene.add(pointLight);

    // Animation variables
    let clock = new THREE.Clock();
    let time = 0;

    // Animation function
    function animate() {
        requestAnimationFrame(animate);

        time += clock.getDelta();

        // Gentle floating animation for nodes
        nodes.forEach((node, index) => {
            const mesh = nodeMeshes[node.id];
            if (mesh) {
                // Float up/down slightly
                mesh.position.y = node.y + Math.sin(time * settings.animationSpeed + index) * 2;
                // Gentle rotation
                mesh.rotation.y = time * settings.animationSpeed * 0.2;
                mesh.rotation.x = time * settings.animationSpeed * 0.1;

                // Update label position
                if (node.labelSprite) {
                    node.labelSprite.position.set(
                        node.x,
                        node.y + Math.sin(time * settings.animationSpeed + index) * 2 + settings.nodeSize + 5,
                        node.z
                    );
                }
            }
        });

        // Pulse connections slightly
        connectionMeshes.forEach((line, index) => {
            line.material.opacity = 0.4 + Math.sin(time * settings.animationSpeed * 0.5 + index) * 0.2;
        });

        controls.update();
        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();

    // Return cleanup function
    return () => {
        window.removeEventListener('resize', onWindowResize);
        container.removeChild(renderer.domElement);
        // Dispose geometries and materials
        nodes.forEach(node => {
            if (nodeMeshes[node.id]) {
                nodeMeshes[node.id].geometry.dispose();
                nodeMeshes[node.id].material.dispose();
            }
        });
        connectionMeshes.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
        scene.dispose();
    };
}

// Helper function to create text sprites for labels
function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};

    const fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    const fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    const borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    const borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    const backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    // background color
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    // border color
    context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, fontsize / 16, 1.0);
    return sprite;
}

// Helper function to draw rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}