(function ($) {
  'use strict';

  // Spinner removal
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 150);
  };
  spinner();

  // Initiate WOW.js for scroll animations
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }

  // Sticky Navbar blur on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $('.navbar.fixed-top').addClass('scrolled');
    } else {
      $('.navbar.fixed-top').removeClass('scrolled');
    }
  });

  // Smooth scrolling on navbar and quick links
  $('.navbar-nav a, .footer-link, a[href^="#"]').on('click', function (event) {
    if (this.hash !== '' && $(this.hash).length) {
      event.preventDefault();

      var targetOffset = $(this.hash).offset().top - 75;

      $('html, body').animate(
        {
          scrollTop: targetOffset,
        },
        1000,
        'easeInOutExpo'
      );

      if ($(this).parents('.navbar-nav').length) {
        $('.navbar-nav .active').removeClass('active');
        $(this).closest('a').addClass('active');
      }

      // Close mobile navbar on click
      if (window.innerWidth < 992) {
        $('#navbarCollapse').collapse('hide');
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1200, 'easeInOutExpo');
    return false;
  });

  // Typed.js Dynamic Typing Animation
  if ($('.typed-text-output').length === 1) {
    var typed_strings = $('.typed-text').text();
    var typed = new Typed('.typed-text-output', {
      strings: typed_strings.split(', '),
      typeSpeed: 70,
      backSpeed: 30,
      backDelay: 2000,
      smartBackspace: true,
      loop: true,
    });
  }

  // Facts counter
  if ($.fn.counterUp) {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000,
    });
  }

  // Skills Progress Bar Animation via Waypoints
  var animateSkills = function () {
    $('.progress .progress-bar').each(function () {
      var val = $(this).attr('aria-valuenow');
      $(this).css('width', val + '%');
    });
  };

  if ($.fn.waypoint && $('.skill').length) {
    $('.skill').waypoint(
      function () {
        animateSkills();
      },
      { offset: '85%' }
    );
  } else {
    // Fallback trigger
    setTimeout(animateSkills, 500);
  }

  // Portfolio Isotope and Filter
  if ($.fn.isotope && $('.portfolio-container').length) {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows',
    });

    $('#portfolio-flters li').on('click', function () {
      $('#portfolio-flters li').removeClass('active');
      $(this).addClass('active');

      portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });

    // Re-layout after images and fonts load
    $(window).on('load', function () {
      portfolioIsotope.isotope('layout');
    });

    setTimeout(function () {
      portfolioIsotope.isotope('layout');
    }, 500);
  }

  // Testimonials Carousel (if present)
  if ($.fn.owlCarousel && $('.testimonial-carousel').length) {
    $('.testimonial-carousel').owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      items: 1,
      dots: true,
      loop: true,
    });
  }
})(jQuery);

// --------------------------------------------------------------------------
// Contact Form Submission (Web3Forms API)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitBtn = this.querySelector('button[type="submit"]');
      var originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
      }

      var formData = new FormData(this);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var notification = document.getElementById('notification');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }

          if (data.success) {
            notification.textContent = 'Message sent successfully! Thank you for reaching out.';
            notification.className = 'alert alert-success';
            notification.style.display = 'block';

            setTimeout(function () {
              notification.style.display = 'none';
            }, 6000);

            contactForm.reset();
          } else {
            notification.textContent = 'Error: ' + data.message;
            notification.className = 'alert alert-danger';
            notification.style.display = 'block';

            setTimeout(function () {
              notification.style.display = 'none';
            }, 6000);
          }
        })
        .catch(function (error) {
          var notification = document.getElementById('notification');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }

          notification.textContent = 'Error: ' + error.message;
          notification.className = 'alert alert-danger';
          notification.style.display = 'block';

          setTimeout(function () {
            notification.style.display = 'none';
          }, 6000);
        });
    });
  }
});
