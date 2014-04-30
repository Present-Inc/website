$(function () {

    module('carousel')

      test('should provide no conflict', function () {
        var carousel = $.fn.carousel.noConflict()
        ok(!$.fn.carousel, 'carousel was set back to undefined (org value)')
        $.fn.carousel = carousel
      })

      test('should be defined on jquery object', function () {
        ok($(document.body).carousel, 'carousel method is defined')
      })

      test('should return element', function () {
        ok($(document.body).carousel()[0] == document.body, 'document.body returned')
      })

      test('should not fire slide when slide is prevented', function () {
        $.support.transition = false
        stop()
        $('<div class="carousel"/>')
          .on('slide.bs.carousel', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .on('slid.bs.carousel', function () {
            ok(false);
          })
          .carousel('next')
      })

      test('should reset when slide is prevented', function () {
        var template = '<div id="carousel-example-generic" class="carousel slide"><ol class="carousel-indicators"><li docs-target="#carousel-example-generic" docs-slide-to="0" class="active"></li><li docs-target="#carousel-example-generic" docs-slide-to="1"></li><li docs-target="#carousel-example-generic" docs-slide-to="2"></li></ol><div class="carousel-inner"><div class="item active"><div class="carousel-caption"></div></div><div class="item"><div class="carousel-caption"></div></div><div class="item"><div class="carousel-caption"></div></div></div><a class="left carousel-control" href="#carousel-example-generic" docs-slide="prev"></a><a class="right carousel-control" href="#carousel-example-generic" docs-slide="next"></a></div>'
        var $carousel = $(template)
        $.support.transition = false
        stop()
        $carousel.one('slide.bs.carousel', function (e) {
          e.preventDefault()
          setTimeout(function () {
            ok($carousel.find('.item:eq(0)').is('.active'))
            ok($carousel.find('.carousel-indicators li:eq(0)').is('.active'))
            $carousel.carousel('next')
          }, 1);
        })
        $carousel.one('slid.bs.carousel', function () {
          setTimeout(function () {
            ok($carousel.find('.item:eq(1)').is('.active'))
            ok($carousel.find('.carousel-indicators li:eq(1)').is('.active'))
            start()
          }, 1);
        })
        $carousel.carousel('next')
      })

      test('should fire slide event with direction', function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" docs-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" docs-slide="next">&rsaquo;</a></div>'
        $.support.transition = false
        stop()
        $(template).on('slide.bs.carousel', function (e) {
          e.preventDefault()
          ok(e.direction)
          ok(e.direction === 'right' || e.direction === 'left')
          start()
        }).carousel('next')
      })

      test('should fire slide event with relatedTarget', function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" docs-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" docs-slide="next">&rsaquo;</a></div>'
        $.support.transition = false
        stop()
        $(template)
          .on('slide.bs.carousel', function (e) {
            e.preventDefault();
            ok(e.relatedTarget);
            ok($(e.relatedTarget).hasClass('item'));
            start();
          })
          .carousel('next')
      })

      test('should set interval from docs attribute', 4, function () {
        var template = $('<div id="myCarousel" class="carousel slide"> <div class="carousel-inner"> <div class="item active"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" href="#myCarousel" docs-slide="prev">&lsaquo;</a> <a class="right carousel-control" href="#myCarousel" docs-slide="next">&rsaquo;</a> </div>');
        template.attr('docs-interval', 1814);

        template.appendTo('body');
        $('[docs-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814);
        $('#myCarousel').remove();

        template.appendTo('body').attr('docs-modal', 'foobar');
        $('[docs-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814, 'even if there is an docs-modal attribute set');
        $('#myCarousel').remove();

        template.appendTo('body');
        $('[docs-slide]').first().click();
        $('#myCarousel').attr('docs-interval', 1860);
        $('[docs-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814, 'attributes should be read only on intitialization');
        $('#myCarousel').remove();

        template.attr('docs-interval', false);
        template.appendTo('body');
        $('#myCarousel').carousel(1);
        ok($('#myCarousel').data('bs.carousel').options.interval === false, 'docs attribute has higher priority than default options');
        $('#myCarousel').remove();
      })
})
