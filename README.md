# sense-Modal
Open a Bootstrap modal from within Qlik Sense (not a mashup). 

![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/senseModal.png)
![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/senseModal2.png)
![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/senseModal3.png)
![Screenshot](https://raw.githubusercontent.com/balexbyrd/img/master/senseModal4.png)

## Installation

1. Move senseModal to the default extension folder in Qlik Sense
2. Open Qlik Sense and add the 'Qlik Sense Modal' extension to a sheet
3. Configure properties

	* **Dimensions** - Used as a field inserted into the current selections, can be removed if not needed.
	* **JSON URL** - The URL the data is sent to. Can be removed if not needed.
	* **Button Name** - The text inside the button.
	* **Font Awesome icon** - The font awesome icon string.

> **Bootstrap info** <http://getbootstrap.com/>

> **Font Awesome icons** <http://fontawesome.io/icons/> - Used to adjust the tab icons

> **Lodash** <https://lodash.com/> - Used for data arrays
	
## Usage

The demo modal is currently an example of how to make an AJAX post, you could also update the modal.html to show a visualization. Within the modal, there is limited form validation on the radio and text input. Check the developers console for the JSON string output and whether it was successfull or not.

> This extension has cross browser compatibility (tested in IE and Chrome)

## Limitations

Tested in Qlik Sense 2.1.1 and Qlik Sense 3.0 in both desktop and server. Sending data to a web services requires additional configurations.

## License

MIT

## Credits

<https://github.com/mcgovey/Namespaced-Bootstrap>