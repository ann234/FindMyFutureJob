function PageTransitions() {

	this.$pages = $( '#pt-main' ).children( 'div.pt-page' );
	this.pagesCount = this.$pages.length;
	this.current = 0;
	this.isAnimating = false;
	this.endCurrPage = false;
	this.endNextPage = false;
	this.animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		};
	// animation end event name
	this.animEndEventName = this.animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	// support css animations
	this.support = Modernizr.cssanimations;

	this.init = function () {
		this.$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		this.$pages.eq( this.current ).addClass( 'pt-page-current' );
	};

	this.nextPage = function () {
		var that = this;
		if( this.isAnimating ) {
			return false;
		}

		this.isAnimating = true;
		
		var $currPage = this.$pages.eq( this.current );

		if( this.current < this.pagesCount - 1 ) {
			++this.current;
		}
		else {
			this.current = 0;
		}

		var $nextPage = this.$pages.eq( this.current ).addClass( 'pt-page-current' ),
			outClass = '', inClass = '';

		outClass = 'pt-page-moveToLeft';
		inClass = 'pt-page-moveFromRight';

		$currPage.addClass( outClass ).on( this.animEndEventName, function() {
			$currPage.off( that.animEndEventName );
			that.endCurrPage = true;
			if( that.endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( this.animEndEventName, function() {
			$nextPage.off( that.animEndEventName );
			that.endNextPage = true;
			if( that.endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !this.support ) {
			onEndAnimation( $currPage, $nextPage );
		}
		this.isAnimating = false;
	};

	this.prevPage = function () {
		var that = this;
		if( this.isAnimating ) {
			return false;
		}

		this.isAnimating = true;

		var $currPage = this.$pages.eq( this.current );

		if( this.current >= 0 ) {
			--this.current;
		}
		else {
			this.current = 0;
		}

		var $nextPage = this.$pages.eq( this.current ).addClass( 'pt-page-current' ),
			outClass = '', inClass = '';

		outClass = 'pt-page-moveToRight';
		inClass = 'pt-page-moveFromLeft';

		$currPage.addClass( outClass ).on( this.animEndEventName, function() {
			$currPage.off( that.animEndEventName );
			that.endCurrPage = true;
			if( that.endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( this.animEndEventName, function() {
			$nextPage.off( that.animEndEventName );
			that.endNextPage = true;
			if( that.endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !this.support ) {
			onEndAnimation( $currPage, $nextPage );
		}
		this.isAnimating = false;
	};

	function onEndAnimation( outpage, inpage ) {
		this.endCurrPage = false;
		this.endNextPage = false;
		resetPage( outpage, inpage );
		this.isAnimating = false;
	}

	function resetPage( outpage, inpage ) {
		outpage.attr( 'class', outpage.data( 'originalClassList' ) );
		inpage.attr( 'class', inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}
}

var pageTransition;