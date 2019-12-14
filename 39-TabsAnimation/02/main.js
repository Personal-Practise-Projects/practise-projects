$("#tab1").click(moveToFirst);
$("#tab2").click(moveToSecond);
$("#tab3").click(moveToThird);
$("#tab4").click(moveToFour);

function moveToFirst() {
	$("#slide").attr('class', 'move-to-first');
	$(".tab").attr('class', 'tab');
	$("#tab1").attr('class', 'tab selected');
}

function moveToSecond() {
	$("#slide").attr('class', 'move-to-second');
	$(".tab").attr('class', 'tab');
	$("#tab2").attr('class', 'tab selected');
}

function moveToThird() {
	$("#slide").attr('class', 'move-to-third');
	$(".tab").attr('class', 'tab');
	$("#tab3").attr('class', 'tab selected');
}

function moveToFour() {
	$("#slide").attr('class', 'move-to-four');
	$(".tab").attr('class', 'tab');
	$("#tab4").attr('class', 'tab selected');
}


this.state = {
	biggestHeight: 0
};
// Loop through elements children to find & set the biggest height
$(".tabs__tabs-container").each(function(){
	// If this elements height is bigger than the biggestHeight
	if ($(this).height() > biggestHeight ) {
		// Set the biggestHeight to this Height
		biggestHeight = $(this).height();
	}
});



// Set the container height
$(".container").height(biggestHeight);
