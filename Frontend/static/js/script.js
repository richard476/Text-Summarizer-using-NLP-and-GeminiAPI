// frontend/static/js/script.js

// --- Three.js 3D Background (Morphing Crystalline Structure) ---
let scene, camera, renderer, crystal, points, grain;
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create the Crystalline Structure
    const geometry = new THREE.IcosahedronGeometry(1, 5);
    geometry.setAttribute('a_original_position', new THREE.BufferAttribute(geometry.attributes.position.clone().array, 3));

    const wireframeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8888ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    crystal = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(crystal);

    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xaaaaff,
        size: 0.03,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);

    // Create the white grain effect
    const grainGeometry = new THREE.BufferGeometry();
    const grainVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        grainVertices.push(x, y, z);
    }
    grainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grainVertices, 3));
    const grainMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.01,
        transparent: true,
        opacity: 0.5
    });
    grain = new THREE.Points(grainGeometry, grainMaterial);
    scene.add(grain);

    animate3D();
}

function animate3D() {
    const elapsedTime = clock.getElapsedTime();

    // Morphing animation for the crystal
    const positions = crystal.geometry.attributes.position.array;
    const originalPositions = crystal.geometry.attributes.a_original_position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];
        const displacement = 
            Math.sin(ox * 2.0 + elapsedTime * 1.5) * 0.05 +
            Math.cos(oy * 3.0 + elapsedTime * 2.0) * 0.05 +
            Math.sin(oz * 2.5 + elapsedTime * 1.0) * 0.05;
        positions[i] = ox + (ox * displacement);
        positions[i + 1] = oy + (oy * displacement);
        positions[i + 2] = oz + (oz * displacement);
    }
    crystal.geometry.attributes.position.needsUpdate = true;


    // Make the camera and grain react to mouse movement
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    grain.position.x = mouse.x * 0.2;
    grain.position.y = -mouse.y * 0.2;

    // Rotate the entire scene slowly
    scene.rotation.y += 0.0005;
    scene.rotation.x += 0.0005;

    renderer.render(scene, camera);
    requestAnimationFrame(animate3D);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}

// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove);

    const textInput = document.getElementById('text-input');
    const summaryOutput = document.getElementById('summary-output');
    const loader = document.getElementById('loader');
    const buttonGroup = document.getElementById('button-group');
    const buttons = buttonGroup.querySelectorAll('.btn');
    const pdfBtn = document.getElementById('pdf-btn');

    const callBackendAPI = async (endpoint) => {
        const text = textInput.value.trim();
        if (!text) {
            summaryOutput.textContent = 'Please enter some text first.';
            return;
        }

        summaryOutput.textContent = '';
        loader.classList.remove('hidden');
        pdfBtn.disabled = true;

        try {
            const apiUrl = `http://127.0.0.1:5000/${endpoint}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `API request failed`);
            }
            if (result.summary) {
                summaryOutput.innerHTML = result.summary.replace(/\n/g, '<br>');
                pdfBtn.disabled = false;
            } else {
                summaryOutput.textContent = 'Could not retrieve a result. ' + (result.error || '');
            }
        } catch (error) {
            summaryOutput.textContent = `An error occurred. Make sure your Python backend is running. Error: ${error.message}`;
        } finally {
            loader.classList.add('hidden');
        }
    };

    buttonGroup.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.btn');
        if (!clickedButton) return;
        buttons.forEach(b => b.classList.replace('btn-primary', 'btn-secondary'));
        clickedButton.classList.replace('btn-secondary', 'btn-primary');
        
        const endpointMap = {
            'gemini-btn': 'summarize-gemini',
            'bullets-btn': 'summarize-gemini-bullets',
            'takeaways-btn': 'summarize-gemini-takeaways',
            'links-btn': 'extract-links',
            'ask-btn': 'ask-gemini'
        };
        const endpoint = endpointMap[clickedButton.id];
        if (endpoint) callBackendAPI(endpoint);
    });

    pdfBtn.addEventListener('click', async () => {
        const textToDownload = summaryOutput.innerText;
        if (!textToDownload || textToDownload.startsWith('An error occurred')) {
            alert('There is no valid summary to download.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToDownload })
            });

            if (!response.ok) throw new Error('PDF generation failed.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'summary.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('PDF Download Error:', error);
            summaryOutput.textContent = 'Could not download PDF. ' + error.message;
        }
    });

    // Add click animations to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease-in-out';
        });
        button.addEventListener('mouseup', () => button.style.transform = 'scale(1)');
        button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
    });
});