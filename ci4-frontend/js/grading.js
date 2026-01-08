/**
 * Grading Services Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initGradingForm();
});

function initGradingForm() {
    const form = document.getElementById('grading-form');
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewBox = document.getElementById('file-preview');
    const previewImg = document.getElementById('preview-img');
    const fileNameEl = document.getElementById('file-name');
    const fileSizeEl = document.getElementById('file-size');
    const removeBtn = document.getElementById('remove-file');
    const statusMsg = document.getElementById('status-message');
    const submitBtn = document.getElementById('submit-btn');

    let selectedFile = null;

    // Drag and Drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragging');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragging');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragging');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    });

    // Remove file
    removeBtn.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        previewBox.style.display = 'none';
        uploadZone.style.display = 'block';
    });

    function handleFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        if (file.size > maxSize) {
            showStatus('File too large. Max 50MB allowed.', 'error');
            return;
        }

        // Note: For RAW files like ARW/DNG, browser support for preview is limited.
        // We'll show a generic icon or the filename for non-standard image types.
        selectedFile = file;
        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        if (allowedTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            // Generic placeholder for RAW/Other files
            previewImg.src = 'assets/placeholder-image.jpg';
        }

        previewBox.style.display = 'block';
        uploadZone.style.display = 'none';
        hideStatus();
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            showStatus('Please upload an image first.', 'error');
            return;
        }

        const email = document.getElementById('email').value;
        const instagram = document.getElementById('instagram').value;
        const consent = document.getElementById('consent').checked;

        if (!consent) {
            showStatus('You must agree to the terms.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';
        showStatus('Processing your request...', 'info');

        try {
            // Mock API call
            console.log('Form submitted:', { email, instagram, selectedFile });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 2000));

            showStatus('Thank you! Your image has been submitted. We will contact you within 24-48 hours.', 'success');
            form.reset();
            selectedFile = null;
            previewBox.style.display = 'none';
            uploadZone.style.display = 'block';

        } catch (error) {
            showStatus('Error uploading file. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit for Grading';
        }
    });

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className = `status-box status-${type}`;
        statusMsg.style.display = 'block';
    }

    function hideStatus() {
        statusMsg.style.display = 'none';
    }
}
