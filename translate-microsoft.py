#!/usr/bin/env python3
#-*- coding: utf-8; -*-

import requests
from requests import Session
from lxml import etree
import json
import time


def translate_microsoft(texts, from_lang='en', to_lang='zh'):
    '''Translation with Microsoft Translator.

    INITIAL SETUP IS NEEDED BEFORE YOU CAN USE THIS FUNCTION.  Refer to
    http://msdn.microsoft.com/en-us/library/dd576287.aspx for more
    details.  If the link does not work, just Google the keywords "bing
    translate api key".

    Args:
        texts (list): list of texts to translate
        from_lang (string): input language code
        to_lang (string): output language code

    Returns:
        dict, with key being the input text, value the translated text.

    '''

    # replace with your client id
    client_id = 'your_client_id';

    # replace with your client secret
    client_secret = 'your_client_secret';

    access_url = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
    access_params = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
        'scope': 'http://api.microsofttranslator.com'
        }

    trans_url = 'http://api.microsofttranslator.com/v2/Http.svc/Translate?'
    trans_params = {
        'from': from_lang,
        'to': to_lang,
        'text': ''
        }

    def get_session():

        token = json.loads(requests.post(access_url, data=access_params).text)
        sess = Session()
        sess.headers = {
        'Authorization': 'Bearer' + ' ' + token['access_token'],
            }

        return sess


    start = time.time()
    sess = get_session()
    ret = {}
    cnt = 0

    for itm in texts:

        # Every session expires after 10mins, so I renew the session
        # every 500 secs.
        end = time.time()
        if end - start > 500.:
            sess = get_session()

        itm = itm.strip()

        if itm:
            trans_params['text'] = itm
            res = sess.get(trans_url, params=trans_params)
            ret[itm] = etree.XML(res.text).text

            # Just to print something indicating I'm working!!
            print(cnt)
            cnt += 1

    return ret

if __name__ == '__main__':
    print(translate_microsoft(['hello world']))
