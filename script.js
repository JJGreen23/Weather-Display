// My API KEY = 28edbc28e241f7bd81a4daf749d5771a

$(document).ready(function() {

  $('#button').on('click', function() {
    let userSearch = $('#userSearch').val();
  
      $('#userSearch').val('');
  
      currentWeatherData(userSearch);

    });
  
    $('.savedUserHistory').on('click', 'li', function() {

      currentWeatherData($(this).text());

    });
  
    displayLi = function(text) {

      let li = $('<li>').text(text);

      $('.savedUserHistory').append(li);
      
    }
  
    currentWeatherData = function(userSearch) {
      $.ajax({
      
        type: 'GET',

        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + userSearch + '&appid=28edbc28e241f7bd81a4daf749d5771a&units=imperial',

        dataType: 'json',

        success: function(data) {

          if (savedUserHistory.indexOf(userSearch) === -1) {

            savedUserHistory.push(userSearch);

            window.localStorage.setItem('savedUserHistory', JSON.stringify(savedUserHistory));
      
            displayLi(userSearch);

          }
          
          $('#currentForecast').empty();
  
          let displayTitle = $('<h3>').text(data.name + ' (' + new Date().toLocaleDateString() + ')');

          let displayTemperature = $('<p>').text('Temperature: ' + data.main.temp + '°F');

          let displayHumidity = $('<p>').text('Humidity: ' + data.main.humidity + '%');

          let displayWind = $('<p>').text('Wind Speed: ' + data.wind.speed + 'MPH');

          let displayCard = $('<div>');

          let displayCardBody = $('<div>');

          let img = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
  
          displayTitle.append(img);

          displayCardBody.append(displayTitle, displayTemperature, displayHumidity, displayWind);
          
          displayCard.append(displayCardBody);

          $('#currentForecast').append(displayCard);

          uvData(data.coord.lat, data.coord.lon);

          fiveDayForecast(userSearch);

        }
      });
    }
    
    fiveDayForecast = function(userSearch) {
      $.ajax({

        type: 'GET',

        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + userSearch + '&appid=28edbc28e241f7bd81a4daf749d5771a&units=imperial',

        dataType: 'json',

        success: function(data) {
          
          for (let i = 0; i < data.list.length; i++) {
            
            if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
                
              let displayTitle = $('<h5>').text(new Date(data.list[i].dt_txt).toLocaleDateString());

              let displayP1 = $('<p>').text('Temp:' + data.list[i].main.temp_max + '°F');

              let displayP2 = $('<p>').text('Humidity:' + data.list[i].main.humidity + '%');
              
              let displayCol = $('<div>');

              let displayCard = $('<div>');

              let displayBody = $('<div>');
  
              let img = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
  
              displayCol.append(displayCard.append(displayBody.append(displayTitle, img, displayP1, displayP2)));

              $('#fiveDayForecast').append(displayCol);

            }
          }
        }
      });
    }
  
    uvData = function(lat, lon) {
      $.ajax({

        type: 'GET',

        url: 'https://api.openweathermap.org/data/2.5/uvi?appid=28edbc28e241f7bd81a4daf749d5771a&lat=' + lat + '&lon=' + lon,

        dataType: 'json',

        success: function(data) {

          let displayUvData = $('<p>').text('UV Index: ');

          let uvCounter = $('<p>').text(data.value);
          
          $('#currentForecast').append(displayUvData.append(uvCounter));

        }
      });
    }
  
    let savedUserHistory = JSON.parse(window.localStorage.getItem('savedUserHistory')) || [];
  
    if (savedUserHistory.length > 0) {

      currentWeatherData(savedUserHistory[savedUserHistory.length-1]);

    }
  
    for (let i = 0; i < savedUserHistory.length; i++) {

      displayLi(savedUserHistory[i]);

    }
  });
  