//sliders

function updateOutput(slider) {
    slider.nextElementSibling.value = slider.value
}

function resetSliders() {
    const sliders = document.querySelectorAll('.data');
    const outputs = document.querySelectorAll('output');

    sliders.forEach(slider => {
        slider.value = slider.getAttribute('value');
        slider.nextElementSibling.textContent = slider.value;
    });

    outputs.forEach(output => {
        output.textContent = output.previousElementSibling.value;
    });
}

window.addEventListener('load', resetSliders);