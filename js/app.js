// a list that holds all of the cards
let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
  opened = [],
  match = 0,
  moves = 0,
  totalCard = symbols.length / 2,
  delay = 400,
  currentTimer,
  second = 0,
  rank3 = 14,
  rank2 = 17,
  rank1 = 20;

  $deck = $('.deck'),
  $scorePanel = $('#score-panel'),
  $movesNumber = $('.moves'),
  $stars = $('.fa-star'),
  $restart = $('.restart'),
  $timer = $('.timer'),



// Initial Game
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function initGame() {
  var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  moves = 0;
  $movesNumber.text('0');
  $stars.removeClass('fa-star-o').addClass('fa-star');
  for (var i = 0; i < cards.length; i++) {
    $deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
  }
  addCardListener();

  resetTimer(currentTimer);
  second = 0;
  $timer.text(`${second}`)
  initTime();
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
// Set Rating and final Score
function setRating(moves) {
  var rating = 3;
  if (moves > rank3 && moves < rank2) {
    $stars.eq(2).removeClass('fa-star').addClass('fa-star-o');
    rating = 2;
  } else if (moves > rank2 && moves < rank1) {
    $stars.eq(1).removeClass('fa-star').addClass('fa-star-o');
    rating = 1;
  } else if (moves > rank1) {
    $stars.eq(0).removeClass('fa-star').addClass('fa-star-o');
    rating = 0;
  }
  return { score: rating };
};

// End Game
function endGame(moves, score) {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Congratulations! You Won!',
    text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Woooooo!',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function (isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
}

// Restart Game
$restart.bind('click', function () {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function (isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var addCardListener = function () {

  // Card flip
  $deck.find('.card').bind('click', function () {
    var $this = $(this)

    if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

    var card = $this.context.innerHTML;
    $this.addClass('open show');
    opened.push(card);

    // Compare with opened card
    if (opened.length > 1) {
      if (card === opened[0]) {
        $deck.find('.open').addClass('match animated infinite rubberBand');
        setTimeout(function () {
          $deck.find('.match').removeClass('open show animated infinite rubberBand');
        }, delay);
        match++;
      } else {
        $deck.find('.open').addClass('notmatch animated infinite wobble');
        setTimeout(function () {
          $deck.find('.open').removeClass('animated infinite wobble');
        }, delay / 1.5);
        setTimeout(function () {
          $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
        }, delay);
      }
      opened = [];
      moves++;
      setRating(moves);
      $moveNum.html(moves);
    }

    // End Game if match all cards
    if (totalCard === match) {
      setRating(moves);
      var score = setRating(moves).score;
      setTimeout(function () {
        endGame(moves, score);
      }, 500);
    }
  });
};


function initTime() {
  currentTimer = setInterval(function () {
    $timer.text(`${second}`)
    second = second + 1
  }, 1000);
}

function resetTimer(timer) {
  if (timer) {
    clearInterval(timer);
  }
}

initGame();
