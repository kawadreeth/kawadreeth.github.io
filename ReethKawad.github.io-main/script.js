function typeEffect(element, speed) {
    const text = element.innerHTML;
    element.innerHTML = "";

    let i = 0;
    const timer = setInterval(function() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Usage
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.typing-effect');
    if (header) {
        typeEffect(header, 200); // Adjust speed as needed
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle-dark-mode');
    toggle.addEventListener('change', function(event) {
      if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  });
  