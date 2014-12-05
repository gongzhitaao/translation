#!/usr/bin/env python3
#-*- coding: utf-8; -*-

import urllib.parse
import urllib.request
import json


def translate_baidu(texts, from_lang='en', to_lang='zh'):
    '''Translate with Baidu Translator.

    INITIAL SETUP IS NEEDED BEFORE YOU CAN USE THIS FUNCTION.  Refer to
    http://developer.baidu.com/wiki/index.php?title=帮助文档首页/百度翻译API
    for more details.  Unfortunately the doc is in Chinese.

    Args:
        texts (list): list of texts to translate
        from_lang (string): input language code
        to_lang (string): output language code

    Returns:
        dict, with key being the input text, value the translated text.

    '''

    baseurl = 'http://openapi.baidu.com/public/2.0/bmt/translate?'
    params = {
        'client_id': 'your_client_id',
        'from': 'en',
        'to': 'zh'
        }
    url = baseurl + urllib.parse.urlencode(params)

    cnt = 0
    ret = {}

    for itm in texts:
        itm = itm.strip()
        if itm:
            q = urllib.parse.urlencode({'q': itm})
            res = urllib.request.urlopen(url + '&' + q).read()
            obj = json.loads(res.decode('utf-8'))
            ret[itm] = obj['trans_result'][0]['dst']

            # Just to print something indicating I'm working!!
            print(cnt)
            cnt += 1

    return ret

if __name__ == '__main__':
    print(translate_baidu(['hello world']))
