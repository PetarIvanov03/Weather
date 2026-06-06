(() => {
    // Inputs
    const tWeight = document.getElementById('mt-total-weight');
    const tCal = document.getElementById('mt-total-cal');
    const tPro = document.getElementById('mt-total-pro');
    const tFat = document.getElementById('mt-total-fat');
    const tCar = document.getElementById('mt-total-car');

    // Slider
    const slider = document.getElementById('mt-slider');
    const percentVal = document.getElementById('mt-percent-val');

    // Outputs
    const pWeight = document.getElementById('mt-port-weight');
    const pCal = document.getElementById('mt-port-cal');
    const pPro = document.getElementById('mt-port-pro');
    const pFat = document.getElementById('mt-port-fat');
    const pCar = document.getElementById('mt-port-car');

    const updatePortion = () => {
        const pct = parseFloat(slider.value) / 100;
        percentVal.textContent = slider.value;

        const w = parseFloat(tWeight.value) || 0;
        const cal = parseFloat(tCal.value) || 0;
        const pro = parseFloat(tPro.value) || 0;
        const fat = parseFloat(tFat.value) || 0;
        const car = parseFloat(tCar.value) || 0;

        pWeight.textContent = (w * pct).toFixed(1).replace(/\.0$/, '');
        pCal.textContent = (cal * pct).toFixed(1).replace(/\.0$/, '');
        pPro.textContent = (pro * pct).toFixed(1).replace(/\.0$/, '');
        pFat.textContent = (fat * pct).toFixed(1).replace(/\.0$/, '');
        pCar.textContent = (car * pct).toFixed(1).replace(/\.0$/, '');
    };

    const inputs = [tWeight, tCal, tPro, tFat, tCar, slider];
    inputs.forEach(el => el.addEventListener('input', updatePortion));

    updatePortion();

    window.currentCleanup = () => {
        inputs.forEach(el => el.removeEventListener('input', updatePortion));
    };
})();
