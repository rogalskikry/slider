/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable computed-property-spacing */
/* eslint-disable space-in-parens */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/**
 * BLOCK: Adchitects Slider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Button, IconButton } = wp.components;
const { InspectorControls, MediaUpload, RichText } = wp.blockEditor;

/**
 * Register: Adchitects Slider Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("grf/gutenberg-adchitects-slider", {
	title: __("Adchitects Slider"),
	icon: "smiley",
	category: "common",
	attributes: {
		items: {
			type: "array",
			default: []
		}
	},
	edit: props => {
		//Obsługa odpowiednio usuwania elementu slidera, bindowanie headera i paragrafu
		const handleRemoveItem = index => {
			const items = [...props.attributes.items];
			items.splice(index, 1);
			props.setAttributes({ items });
		};

		const handleHeaderChange = (header, index) => {
			const items = [...props.attributes.items];
			items[index].header = header;
			props.setAttributes({ items });
		};

		const handleParagraphChange = (paragraph, index) => {
			const items = [...props.attributes.items];
			items[index].paragraph = paragraph;
			props.setAttributes({ items });
		};

		let itemDisplay, itemsIDs;

		if (props.attributes.items.length) {
			itemsIDs = [];
			itemDisplay = props.attributes.items.map((item, index) => {
				itemsIDs.push(item.id);
				return (
					<div className="editor-slider__item" key={index}>
						<IconButton
							className="editor-slider__btn--delete"
							icon="no-alt"
							label="Delete item"
							onClick={() => handleRemoveItem(index)}
						/>
						<div className="editor-slider__text">
							<RichText
								tagName="h4"
								value={props.attributes.items[index].header}
								onChange={header => handleHeaderChange(header, index)}
								placeholder="Enter your header here!"
							/>
							<RichText
								tagName="p"
								value={props.attributes.items[index].paragraph}
								onChange={paragraph => handleParagraphChange(paragraph, index)}
								placeholder="Enter your paragraph here!"
							/>
						</div>
						<img alt={item.alt} src={item.url}></img>
					</div>
				);
			});
		}

		const ALLOWED_MEDIA_TYPES = "image";

		let editorFront;

		const handleMediaChange = media => {
			let items = props.attributes.items;
			items = media;
			props.setAttributes({ items });
		};

		//Jezeli elementy są juz daodane do slidera to je pokaz, jezeli nie, to pokaz przycisk dodawania galerii
		if (itemDisplay) {
			editorFront = (
				<div className="editor-slider" key="2">
					{itemDisplay}
				</div>
			);
		} else {
			editorFront = (
				<MediaUpload
					onSelect={media => handleMediaChange(media)}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					multiple={true}
					gallery={true}
					value={itemsIDs || null}
					render={({ open }) => (
						<Button className="btn--add" onClick={open}>
							Add Images Here
						</Button>
					)}
				/>
			);
		}

		return [
			<InspectorControls key="1">
				<MediaUpload
					onSelect={media => handleMediaChange(media)}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					multiple={true}
					gallery={true}
					value={itemsIDs || null}
					render={({ open }) => (
						<Button className="btn--add" onClick={open}>
							Add Images Here
						</Button>
					)}
				/>
			</InspectorControls>,
			<div key="2">{editorFront}</div>
		];
	},
	save: props => {
		const itemDisplay = props.attributes.items.map((item, index) => {
			return (
				<div
					key={index}
					className={"carousel-item " + (index === 0 ? "active" : "")}
				>
					<div className="carousel-item__text">
						<h4 className="carousel-item__header">{item.header}</h4>
						<p className="carousel-item__paragraph">{item.paragraph}</p>
					</div>
					<img className="d-block w-100" alt={item.alt} src={item.url}></img>
				</div>
			);
		});

		// Tworze wskaźniki dla itemów slidera
		const carouselIndicators = props.attributes.items.map((item, index) => {
			return (
				<li
					key={index}
					className={index === 0 ? "active" : ""}
					data-target="#carouselIndicators"
					data-slide-to={index}
				>
					{index + 1}
				</li>
			);
		});

		let carouselWrapper;

		// Jeżeli jest tylko jeden elemement slidera, to nie pokazuj wskaznikow
		if (props.attributes.items.length > 1) {
			carouselWrapper = (
				<div className="carousel-control__wrapper">
					<a
						className="carousel-control-prev"
						href="#carouselIndicators"
						role="button"
						data-slide="prev"
					>
						<span
							className="carousel-control-prev-icon"
							aria-hidden="true"
						></span>
						<span className="sr-only">Previous</span>
					</a>
					<ol className="carousel-indicators">{carouselIndicators}</ol>
					<a
						className="carousel-control-next"
						href="#carouselIndicators"
						role="button"
						data-slide="next"
					>
						<span
							className="carousel-control-next-icon"
							aria-hidden="true"
						></span>
						<span className="sr-only">Next</span>
					</a>
				</div>
			);
		} else {
			carouselWrapper = "";
		}

		return (
			<div key="2" id="carouselIndicators" className="carousel slide">
				{carouselWrapper}
				<div className="carousel-inner">{itemDisplay}</div>
			</div>
		);
	}
});
