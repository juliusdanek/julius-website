$(document).ready(function() {

	$('.munich').click(function() {
		removeAndSlide();
		addAndSlide(".munich-image");
		$('.munich-image').css('display', 'block');
		addAndSlide(".munich-text");
	});

	$('.education').click(function() {
		removeAndSlide();
		addAndSlide(".education-image");
		$('.education-image').css('display', 'block');
		addAndSlide(".education-text");
	});

	$('.travel').click(function() {
		removeAndSlide();
		addAndSlide(".travel-image");
		$('.travel-image').css('display', 'block');
		addAndSlide(".travel-text")
	});			

	$('.hobbies').click(function() {
		removeAndSlide();
		addAndSlide(".hobbies-image");
		$('.hobbies-image').css('display', 'block');
		addAndSlide(".hobbies-text");
	});

	// $(".about-nav").click(function() {
	// 	to_position(".about-me");
	// 	$(".navbar-collapse").attr("aria-expanded", "false")
	// 	$(".navbar-collapse").removeClass("in")
	// });

	// $(".navbar-brand").click(function() {
	// 	to_position(".navbar-brand");
	// })

    console.log("custom.js loaded")
});


// This function lets the currently active class disappear via SlideUp and then removes all the active tags
var removeAndSlide = function() {
	$('.active').slideUp();
	$('.active').removeClass("active");
};

// This function is similar to removeAndSlide in that it allows a class to appear and add the tag active to it

var addAndSlide = function(custom_class) {
	$(custom_class).slideDown();
	$(custom_class).addClass("active");
}

// function to_position(custom_class){
//      $('html, body').animate({scrollTop:$(custom_class).position().top - 50 }, 'slow');
// };