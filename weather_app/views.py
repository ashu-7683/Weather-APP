from django.shortcuts import render
import requests

def Home(request):
    """ Api From OpenWeatherMap """

    key = '0238e6f236b3a27821e6bffb24b4bd37'  #openweathermap free api key
    url = 'https://api.openweathermap.org/data/2.5/weather?q={}&appid={}&units=metric'


    if request.method == "POST":
        city = request.POST.get('city', '')

        try:
            result = requests.get(url.format(city, key)).json()
            context = {
                "city": city,
                'temp': result['main']['temp'],
                'description': result['weather'][0]['description'],
                'city_name': result['name'],
                'country_code': result['sys']['country'],
                'humidity': result['main']['humidity'],
                'wind_speed': round(result['wind']['speed'] * 3.6, 2)
            }
        except Exception as e:
            print(f'Error: {e}')
            context = {
                "city": city,
                'error': 'City not found or API error. Please try again.'
            }
    else:
        context = {}
    return render(request,'index.html',context)