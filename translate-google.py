#-*- coding: utf-8; -*-

from requests import Session
import time
import random

def translate_google(texts, from_lang='en', to_lang='zh'):
    '''Translate with Google Translator.

    *NOTE*: GOOGLE HAS CANCELED THE FREE TRANSLATION API SERVICE.
    ALTHOUGH THIS FUNCTION WORKS, IT IS FOR STUDY USE ONLY.  USE AT
    YOUR OWN RISK.

    This version is modified from
    https://github.com/mouuff/Google-Translate-API.

    Args:
        texts (list): list of texts to translate
        from_lang (string): input language code
        to_lang (string): output language code

    Returns:
        dict, with key being the input text, value the translated text.

    '''

    agents = {
        'User-Agent':"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)"
        }
    before_trans = 'class="t0">'

    link = 'http://translate.google.com/m'
    params = {
        'hl': to_lang,
        'sl': from_lang,
        'q': ''
        }

    sess = Session()
    sess.headers = {
        'User-Agent': "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)"
        }

    ret = {}

    for itm in texts:
        itm = itm.strip()

        if itm:
            params['q'] = itm
            html = sess.get(link, params=params).text
            res = html[html.find(before_trans) + len(before_trans):]
            ret[itm] = res.split("<")[0]

        # Google has canceled free translation api service, in order
        # not to be banned from Google server, we pause a bit.
        time.sleep(random.randint(3, 8))

    return ret

if __name__ == '__main__':
    print(translate_google(['hello world']))
