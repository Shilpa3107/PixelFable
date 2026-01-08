/**
 * Contact Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactPage();
});

function initContactPage() {
    const categoryCards = document.querySelectorAll('.category-card');
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('contact-status');
    const submitBtn = document.getElementById('contact-submit');

    let selectedCategory = 'general';

    // Category Selection
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all
            categoryCards.forEach(c => c.classList.remove('active'));
            // Add to clicked
            card.classList.add('active');
            selectedCategory = card.dataset.category;
            console.log('Selected category:', selectedCategory);
        });
    });

    // Form Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        showStatus('Sending your message...', 'info');

        try {
            // Mock API call
            console.log('Contact Submision:', {
                name,
                email,
                subject,
                message,
                category: selectedCategory
            });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 1500));

            showStatus('Success! Your message has been sent. We will get back to you shortly.', 'success');
            contactForm.reset();

            // Set first category back to active
            categoryCards.forEach(c => c.classList.remove('active'));
            categoryCards[0].classList.add('active');
            selectedCategory = 'general';

        } catch (error) {
            showStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className = `status-box status-${type}`;
        statusMsg.style.display = 'block';
    }
}
