$(document).ready(function () {

	// Check if the local storage is supported on the client browser
	if (typeof(Storage) === "undefined") {
		alert("Sorry, local storage is currently not supported on your browser.");
	}

	$create = $('.main-nav').find('#create');

	$actionSection = $('.main-body').find('.action-section');
	$listSection = $('.main-body').find('.list-section');

	$actionSectionClose = $actionSection.find('#close');
	$actionContent = $actionSection.find('#content');

	$add = $actionSection.find('#add');

	var isCreateToggled = false;

	// Initialize
	if (localStorage.length !== 0) {
		var keys = Object.keys(localStorage);
		$.each(keys, function (i, key) {
			var uniqueId = key;
			var content = localStorage.getItem(key);

			var template = 
				'<div class="list" id="' + uniqueId + '">'
					+ '<div class="menu">'
						+ '<div class="item" id="close">'
							+ '<span class="fa fa-times"></span>'
						+ '</div>'
						+ '<div class="item" id="edit">'
							+ '<span class="fa fa-edit"></span>'
						+ '</div>'
					+ '</div>'
					+ '<div class="content">'
						+ '<p>' + content + '</p>'
					+ '</div>'
				+ '</div>';
			
			var $template = $(template);
			$listSection.append($template);

		});

		registerListEventListeners();
	}

	// Toggle when create is clicked
	$create.click(function () {
		toggleCreateSection();
	});

	$actionContent.focus(function (e) {
		e.preventDefault();
	});

	// Hide the action section when close button is clicked
	$actionSectionClose.click(function () {
		hideCreateSection();
	});

	// When add button is clicked
	$add.click(function (e) {

		e.preventDefault();

		var content = $actionSection
			.find('.content')
			.find('textarea')
			.val();

		var uniqueId = Date.now();

		// TODO: Append the item
		var template = 
				'<div class="list" id="' + uniqueId + '">'
					+ '<div class="menu">'
						+ '<div class="item" id="close">'
							+ '<span class="fa fa-times"></span>'
						+ '</div>'
						+ '<div class="item" id="edit">'
							+ '<span class="fa fa-edit"></span>'
						+ '</div>'
					+ '</div>'
					+ '<div class="content">'
						+ '<p>' + content + '</p>'
					+ '</div>'
				+ '</div>';

		var $template = $(template);

		$listSection.append($template);

		unregisterListEventListeners();
		registerListEventListeners();
		
		// Store the content to the local storage
		localStorage.setItem(uniqueId, content);

		$actionContent.val('');
		hideCreateSection();
	});

	/**
	 * @debug
	 * Debugging purpose
	 */
	$(document).keypress(function (e) {

		// Space bar is pressed
		if (e.which == 32) {
			console.log(localStorage);
		}

		if (e.which == 13) {
			localStorage.clear();
		}
	})
	/**
	 * Loop all items and register its event listeners
	 * @return void
	 */
	function registerListEventListeners()
	{
		var $items = $listSection.find('.list');

		$.each($items, function (index, item) {
			var $item = $(item);
			var $close = $item.find('#close');
			var $edit = $item.find('#edit');

			var $textarea = $item.find('.content').find('textarea');

			var isToggleEdited = (($textarea.length > 0) ? true : false);

			// When close is clicked
			$close.click(function () {
				var flag = confirm("Are you sure?");
				var uniqueId = $item.attr('id');

				if (flag) {
					$item.hide();
					localStorage.removeItem(uniqueId);
				}
			});

			// When edit is clicked
			$edit.click(function () {
				var $parent = $(this).parents('.list').first();								
				var $content = $parent.find('.content');
				var $paragraph = $content.find('p');

					
				// If not toggled
				if (isToggleEdited === false) {
					var content = $content.find('p').text();
					var $textarea = $('<textarea></textarea>').val(content);
					
					$paragraph.hide();
					$content.append($textarea);
				} 
				// if it is toggled
				else {
					var $textarea = $content.find('textarea');
					var uniqueId = $parent.attr('id');

					var content = $textarea.val();

					$paragraph.text(content);
					$paragraph.show();

					// Save the content
					localStorage.setItem(uniqueId, content);

					if ($textarea)
						$textarea.remove();
				}

				isToggleEdited = !isToggleEdited;
			});
		});
	}

	/**
	 * Loop all items and unregister its event listeners
	 * @return void
	 */
	function unregisterListEventListeners()
	{
		var $items = $listSection.find('.list');

		$.each($items, function (index, item) {
			var $item = $(item);
			var $close = $item.find('#close');
			var $edit = $item.find('#edit');

			$close.off('click');
			$edit.off('click');
		});
	}

	/**
	 * Toggle the create section
	 * when the plus / create button is clicked
	 * @return void
	 */
	function toggleCreateSection()
	{
		if (isCreateToggled == false) {
			// Show the create section
			$actionSection.show();
		} else {
			// Hide the create section
			$actionSection.hide();
		}

		isCreateToggled = !isCreateToggled;
	}

	/**
	 * Programmatically hide the create section
	 * @return void
	 */
	function hideCreateSection() {
		$actionSection.hide();
		isCreateToggled = false;
	}
});