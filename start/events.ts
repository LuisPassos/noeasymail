/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import axios from 'axios'

Event.on('new:request', () => {
   axios.get('https://api.countapi.xyz/hit/nem_api_2fa_pt_prod/api')
})