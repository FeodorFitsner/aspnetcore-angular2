"use strict";

import {bootstrap} from 'angular2/platform/browser'
import {FormBuilder} from 'angular2/common'
import * as router from 'angular2/router';
import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { App } from './app';

bootstrap(App, [router.ROUTER_PROVIDERS, HTTP_PROVIDERS, FormBuilder]);