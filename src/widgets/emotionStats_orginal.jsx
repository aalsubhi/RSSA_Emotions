import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function EmotionStats(props) {
	const movie = props.movie;
	const emotions = [
		{ emo: 'Joy', max: 0.318181818181818, min: 0.0382546323968918 },
		{ emo: 'Trust', max: 0.253994490358127, min: 0.0817610062893082 },
		{ emo: 'Fear', max: 0.209126984126984, min: 0.0273270708795901 },
		{ emo: 'Surprise', max: 0.166202984427503, min: 0.0256678889470927 },
		{ emo: 'Sadness', max: 0.188492063492063, min: 0.025706940874036 },
		{ emo: 'Disgust', max: 0.157538659793814, min: 0.00886524822695036 },
		{ emo: 'Anger', max: 0.182929272690844, min: 0.0161596958174905 },
		{ emo: 'Anticipation', max: 0.251623376623377, min: 0.0645546921697549 }
	];

	const floatToHexStr = (float) => {
		let hex = Math.round(float * 255).toString(16);
		if (hex.length === 1) {
			hex = '0' + hex;
		}
		return hex;
	}

	const getEmoScaled = (emo, movieEmotions) => {
		const emoVal = movieEmotions[emo.emo.toLowerCase()];
		return (emoVal - emo.min) / (emo.max - emo.min);
	}

	const hslToRgb = (h, s, l) => {
		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}


	const numberToColorHsl = (emoVal, emoMin, emoMax) => {
		let ratio = emoVal;
		if (emoMin > 0 || emoMax < 1) {
			if (emoVal < emoMin) {
				ratio = 0;
			} else if (emoVal > emoMax) {
				ratio = 1;
			} else {
				var range = emoMax - emoMin;
				ratio = (emoVal - emoMin) / range;
			}
		}

		// as the function expects a value between 0 and 1, and red = 0° and green = 120°
		// we convert the input to the appropriate hue value
		const hue = ratio * 1.2 / 3.60;

		// we convert hsl to rgb (saturation 100%, lightness 50%)
		const rgb = hslToRgb(hue, 1, .5);
		// we format to css value and return
		return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	}

	const linearGradient = (emo, movieEmotions) => {
		const emoVal = movieEmotions[emo.emo.toLowerCase()];
		const gradStart = numberToColorHsl(emo.min, emo.min, emo.max);
		const gradEnd = numberToColorHsl(emoVal, emo.min, emo.max);

		return 'linear-gradient(90deg, ' + gradStart + ', ' + gradEnd + ')';
	}

	const getEmoBar = (emo, movieEmotions) => {
		const emoVal = movieEmotions[emo.emo.toLowerCase()];

		return numberToColorHsl(emoVal, emo.min, emo.max);
	}


	return (
		<div>
			<div className="emoStatbars">
				{
					emotions.map((emotion, i) =>
						<Row key={emotion.emo + '_' + i + '_' + movie.id} md={2} style={{ margin: "1px 0", height: "27px" }}>
							{/* <Col className="d-flex" md={{ span: 3, offset: 3 }} style={{ padding: "0" }} > */}
								<p style={{ margin: "auto 0", textAlign: "right" }}>{emotion.emo}</p>
							{/* </Col> */}
							{/* <Col md={{ span: 3, offset: 0 }} style={{ margin: "auto 0" }}> */}
								<ProgressBar style={{margin: "auto 0", padding: "inherit"}}>
									<ProgressBar style={{ background: linearGradient(emotion, props.movie.emotions) }}
										now={getEmoScaled(emotion, props.movie.emotions) * 100} />
								</ProgressBar>
							{/* </Col> */}
						</Row>
					)
				}
			</div>
		</div>
	)

}