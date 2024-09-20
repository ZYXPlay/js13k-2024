import { imageGeneration } from "../engine/image-generation";

export default () => imageGeneration({
  draw(ctx) {
    ctx.save();
    ctx.translate(0, -100);
    const path = new Path2D('M42 166L33.7188 157.719V132.812L42 124.531H47.5312V157.719H59.375V166H42ZM60 136.969V132.812H49.7188V124.531H66.5625L73.8125 132.812V136.969H60ZM61.5625 166V151.219H54.8438V143H73.8125V166H61.5625ZM109.5 166L107.75 161.469H94.1875L97.0625 153.25H104.562L93.4688 124.531H106.938L123.469 166H109.5ZM77.1562 166L91.9688 126.406L98.0938 142.875L90.5 166H77.1562ZM151.781 166L127.188 124.531H141.875L153 142.969L161.75 127.969V148.844L151.781 166ZM163.781 166V124.531H177.594V166H163.781ZM127.156 166V128.375L140.062 150.031V166H127.156ZM184.281 166V124.531H198.094V140.969H211.312V148.969H198.094V166H184.281ZM208.875 136.531V132.562H200.281V124.531H221.875V136.531H208.875ZM200.281 166V157.719H208.062V153.562H221.875V166H200.281ZM61.5 221V212.562H66.7812V187.938H61.5V179.531H72.2188L80.5938 187.812V212.719L72.2188 221H61.5ZM48.6875 221L40.2812 212.719V187.812L48.6875 179.531H59.3125V187.938H54.125V212.562H59.3125V221H48.6875ZM97.7188 221L82.7188 179.531H96.8125L111.156 221H97.7188ZM112.844 219.75L106.625 201.5L113.312 179.531H127.188L112.844 219.75ZM130.625 221V179.531H144.438V195.969H157.656V203.969H144.438V221H130.625ZM155.219 191.531V187.562H146.625V179.531H168.219V191.531H155.219ZM146.625 221V212.719H154.406V208.562H168.219V221H146.625ZM190.625 208.562V200.531H201V187.812H190.625V179.531H206.406L214.719 187.812V200.25L208.281 206.688L216.125 221H201.375L195.5 208.562H190.625ZM174.625 221V179.531H188.438V221H174.625Z');
    ctx.fillStyle = 'white';
    ctx.fill(path);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-in';

    const gradient = ctx.createLinearGradient(0, 20, 0, 120);
    gradient.addColorStop(0, 'rgb(255, 255, 255, 1)');
    gradient.addColorStop(0.31, 'rgb(255, 255, 0, 1)');
    gradient.addColorStop(0.71, 'rgb(172, 124 ,0, 1)');
    gradient.addColorStop(1, 'rgb(248, 56 ,0, 1)');
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 240);
  
    ctx.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.translate(0, -100);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke(path);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke(path);
    ctx.restore();
  },
});