import React, {Component} from 'react';
import _ from 'lodash';
// import PropTypes from 'prop-types';
import Vizceral from 'vizceral-react';

import queryString from 'query-string';

import DetailsPanelConnection from './detailsPanelConnection';
import DetailsPanelNode from './detailsPanelNode';

import './index.css';


const hasOwnPropFunc = Object.prototype.hasOwnProperty;

const panelWidth = 400;

class ModelGraph extends Component {
    constructor (props) {
        super(props);

        this.state = {
            currentView: undefined,
            redirectedFrom: undefined,
            selectedChart: undefined,
            displayOptions: {
                allowDraggingOfNodes: false,
                showLabels: true
            },
            currentGraph_physicsOptions: {
                isEnabled: true,
                viscousDragCoefficient: 0.2,
                hooksSprings: {
                    restLength: 50,
                    springConstant: 0.2,
                    dampingConstant: 0.1
                },
                particles: {
                    mass: 1
                }
            },
            labelDimensions: {},
            searchTerm: '',
            matches: {
                total: -1,
                visible: -1
            },
            // trafficData: {
            //     "renderer": "global",
            //     "name": "edge",
            //     "nodes": [
            //         {
            //             "renderer": "region",
            //             "name": "INTERNET",
            //             "displayName": "INTERNET",
            //             "nodes": [],
            //             "metadata": {},
            //             "class": "normal",
            //             "connections": []
            //         },
            //         {
            //             "renderer": "region",
            //             "name": "us-east-1",
            //             "displayName": "US-EAST-1",
            //             "updated": 1477690448572,
            //             "nodes": [
            //                 {
            //                     "name": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tetrabrach",
            //                             "metrics": {
            //                                 "normal": 41515.944,
            //                                 "danger": 66.144
            //                             }
            //                         },
            //                         {
            //                             "name": "colloidal",
            //                             "metrics": {
            //                                 "danger": 0.166,
            //                                 "normal": 126.34000000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "wardrobers"
            //                         },
            //                         {
            //                             "name": "yplast"
            //                         },
            //                         {
            //                             "name": "benet",
            //                             "metrics": {
            //                                 "danger": 0.22400000000000003,
            //                                 "normal": 130.17600000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "imping",
            //                             "metrics": {
            //                                 "danger": 0.22000000000000003,
            //                                 "normal": 130.19000000000003
            //                             }
            //                         },
            //                         {
            //                             "name": "virility",
            //                             "metrics": {
            //                                 "danger": 0.18600000000000003,
            //                                 "normal": 130.158
            //                             }
            //                         },
            //                         {
            //                             "name": "eng",
            //                             "metrics": {
            //                                 "danger": 0.244,
            //                                 "normal": 129.494
            //                             }
            //                         },
            //                         {
            //                             "name": "use",
            //                             "metrics": {
            //                                 "danger": 0.2,
            //                                 "normal": 126.536
            //                             }
            //                         },
            //                         {
            //                             "name": "racegoings",
            //                             "metrics": {
            //                                 "danger": 0.06999999999999999,
            //                                 "normal": 43.19200000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "amperzands",
            //                             "metrics": {
            //                                 "danger": 0.006,
            //                                 "normal": 18187.73
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "blamer",
            //                             "metrics": {
            //                                 "danger": 4.220000000000001,
            //                                 "normal": 12450.862000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lassoing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "jumbies",
            //                             "metrics": {
            //                                 "danger": 9429.436,
            //                                 "normal": 124.54400000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "prefocuses",
            //                             "metrics": {
            //                                 "danger": 1,
            //                                 "normal": 7877.054
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "difference",
            //                             "metrics": {
            //                                 "normal": 6652.246000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "nymphae",
            //                             "metrics": {
            //                                 "normal": 4804.088,
            //                                 "danger": 0.264
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "decreasingly",
            //                             "metrics": {
            //                                 "normal": 3919.876
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "reformings",
            //                             "metrics": {
            //                                 "danger": 0.036,
            //                                 "normal": 3147.704
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "unaligned",
            //                             "metrics": {
            //                                 "normal": 3954.196
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "macrurous",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tsesarevich",
            //                             "metrics": {
            //                                 "danger": 2095.25,
            //                                 "normal": 146.374
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "hoarded",
            //                             "metrics": {
            //                                 "normal": 4063.334
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "lanterning",
            //                             "metrics": {
            //                                 "danger": 0.18000000000000002,
            //                                 "normal": 4572.996
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "fructiferous",
            //                             "metrics": {
            //                                 "normal": 1918.0560000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "langered",
            //                             "metrics": {
            //                                 "danger": 0.03,
            //                                 "normal": 1853.6560000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "undercapitalize",
            //                             "metrics": {
            //                                 "normal": 1786.8860000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "launches",
            //                             "metrics": {
            //                                 "normal": 1809.534
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "epistolised",
            //                             "metrics": {
            //                                 "danger": 1.234,
            //                                 "normal": 3651.6760000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "salix",
            //                             "metrics": {
            //                                 "normal": 38.160000000000004
            //                             }
            //                         },
            //                         {
            //                             "name": "ossifrage",
            //                             "metrics": {
            //                                 "normal": 38.142
            //                             }
            //                         },
            //                         {
            //                             "name": "incandesce",
            //                             "metrics": {
            //                                 "normal": 1526.7520000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "modernised",
            //                             "metrics": {
            //                                 "danger": 12.940000000000001,
            //                                 "normal": 2329.168
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "thewiest",
            //                             "metrics": {
            //                                 "normal": 1159.382
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "shikari",
            //                             "metrics": {
            //                                 "normal": 1110.976
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "villous",
            //                             "metrics": {
            //                                 "danger": 0.03,
            //                                 "normal": 976.5799999999999
            //                             }
            //                         },
            //                         {
            //                             "name": "silvan",
            //                             "metrics": {
            //                                 "normal": 24.682000000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "yechs",
            //                             "metrics": {
            //                                 "normal": 24.974000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "pleas",
            //                             "metrics": {
            //                                 "danger": 0.022000000000000002,
            //                                 "normal": 828.868
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "astones",
            //                             "metrics": {
            //                                 "normal": 6.038
            //                             }
            //                         },
            //                         {
            //                             "name": "blamelessnesses",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 1092.528
            //                             }
            //                         },
            //                         {
            //                             "name": "grouched",
            //                             "metrics": {
            //                                 "normal": 6.038
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "dogships",
            //                             "metrics": {
            //                                 "normal": 926.2660000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "metrifier",
            //                             "metrics": {
            //                                 "normal": 692.9520000000001,
            //                                 "danger": 0.06999999999999999
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "coho",
            //                             "metrics": {
            //                                 "danger": 0.008,
            //                                 "normal": 635.724
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "flamethrowers",
            //                             "metrics": {
            //                                 "normal": 540.194
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "garnishes",
            //                             "metrics": {
            //                                 "danger": 0.05,
            //                                 "normal": 1264.71
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cockieleekies",
            //                             "metrics": {
            //                                 "normal": 1078.5700000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "invulnerableness",
            //                             "metrics": {
            //                                 "normal": 429.798
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "rehabbed",
            //                             "metrics": {
            //                                 "normal": 204.92
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "slimy",
            //                             "metrics": {
            //                                 "danger": 39.67400000000001,
            //                                 "normal": 443.384
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "powhiris",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 527.11
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "lampadary",
            //                             "metrics": {
            //                                 "normal": 287.28200000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "imbalmers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "imposthumated",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 292.37800000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tawiest",
            //                             "metrics": {
            //                                 "normal": 286.03200000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "pashed",
            //                             "metrics": {
            //                                 "normal": 283.108
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cauterises",
            //                             "metrics": {
            //                                 "danger": 1.9000000000000001,
            //                                 "normal": 289.13000000000005
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "steen",
            //                             "metrics": {
            //                                 "danger": 6.188000000000001,
            //                                 "normal": 182.4
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "malleolar",
            //                             "metrics": {
            //                                 "normal": 34.352,
            //                                 "danger": 153.10999999999999
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "microparasites",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "ribbonwoods",
            //                             "metrics": {
            //                                 "danger": 1.5460000000000003,
            //                                 "normal": 848.7139999999999
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "remit",
            //                             "metrics": {
            //                                 "normal": 185.476
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "gimmes",
            //                             "metrics": {
            //                                 "normal": 180.044
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "alignment",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "madronos",
            //                             "metrics": {
            //                                 "normal": 156.94000000000003,
            //                                 "danger": 0.006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "fraicheurs",
            //                             "metrics": {
            //                                 "danger": 0.020000000000000004,
            //                                 "normal": 130.428
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "remarkableness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "hydrocortisones",
            //                             "metrics": {
            //                                 "danger": 0.21600000000000003,
            //                                 "normal": 110.20400000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "trapan",
            //                             "metrics": {
            //                                 "normal": 99.77600000000001,
            //                                 "danger": 4.946000000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "belons",
            //                             "metrics": {
            //                                 "danger": 0.148,
            //                                 "normal": 97.73200000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "karroos",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "kitschified",
            //                             "metrics": {
            //                                 "danger": 0.8340000000000001,
            //                                 "normal": 80.06
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "disfranchise",
            //                             "metrics": {
            //                                 "normal": 72.478,
            //                                 "danger": 20.21
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "espiers",
            //                             "metrics": {
            //                                 "danger": 0.654,
            //                                 "normal": 62.326
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cybersquattings",
            //                             "metrics": {
            //                                 "normal": 62.026
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "versionings",
            //                             "metrics": {
            //                                 "normal": 60.43600000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "unacquainted",
            //                             "metrics": {
            //                                 "danger": 0.014000000000000002,
            //                                 "normal": 972.9639999999999
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "metabolised",
            //                             "metrics": {
            //                                 "danger": 2.068,
            //                                 "normal": 41.752
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "anthoid",
            //                             "metrics": {
            //                                 "normal": 0.22200000000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "localizable",
            //                             "metrics": {
            //                                 "normal": 0.638
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "misprinting",
            //                             "metrics": {
            //                                 "danger": 0.014000000000000002,
            //                                 "normal": 121.306
            //                             }
            //                         },
            //                         {
            //                             "name": "revoiced",
            //                             "metrics": {
            //                                 "normal": 4.332
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "radiations",
            //                             "metrics": {}
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "sklenting",
            //                             "metrics": {
            //                                 "danger": 0.6240000000000001,
            //                                 "normal": 22.904
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "allographs",
            //                             "metrics": {
            //                                 "normal": 22.882
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "bypath",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "hydroxyureas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "turms",
            //                             "metrics": {
            //                                 "normal": 18.126
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gradine",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "smirches",
            //                             "metrics": {
            //                                 "normal": 12.21
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "atma",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "palpebrae",
            //                             "metrics": {
            //                                 "normal": 433.92600000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cleavage",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "rezzes"
            //                         },
            //                         {
            //                             "name": "montre",
            //                             "metrics": {
            //                                 "normal": 105.25999999999999
            //                             }
            //                         },
            //                         {
            //                             "name": "alibis",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 105.17200000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "appropriable",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "talkathon",
            //                             "metrics": {
            //                                 "normal": 613.17,
            //                                 "danger": 0.006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "name": "INTERNET",
            //                     "renderer": "focusedChild"
            //                 }
            //             ],
            //             "connections": [
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-prod",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 97.98200000000001,
            //                         "normal": 32456.61
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 18.094,
            //                         "normal": 11850.946000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-log",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "warning": 0.006,
            //                         "danger": 1.218,
            //                         "normal": 8232.9
            //                     }
            //                 },
            //                 {
            //                     "source": "quittors",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 117.234
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.288,
            //                         "normal": 71.542
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 74.566
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 41.47
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 94.49000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 37.038000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.028000000000000004,
            //                         "normal": 133.47
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.1340000000000001,
            //                         "normal": 183.386
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.016,
            //                         "normal": 10.14
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 27.386000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.016,
            //                         "normal": 11.846
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 43.642,
            //                         "normal": 7428.756
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 29.874000000000002,
            //                         "normal": 1947.2400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 13.984000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 134.15
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 105.06600000000002,
            //                         "danger": 0.006
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.05600000000000001,
            //                         "normal": 178.37400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 655.186
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.256,
            //                         "normal": 32.978
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.256,
            //                         "normal": 32.978
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.256,
            //                         "normal": 32.978
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.118,
            //                         "normal": 109.57600000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.066,
            //                         "normal": 11.408000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.202
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 1017.616
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.9720000000000001,
            //                         "normal": 160.19000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 3.814,
            //                         "normal": 634.038
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.064,
            //                         "normal": 87.34
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 244.97600000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 6.184000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 6.184000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 6.184000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 7.18,
            //                         "normal": 1576.49
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 19.136000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 19.558000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 19.632
            //                     }
            //                 },
            //                 {
            //                     "source": "cylindricalness",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 69.866
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.024,
            //                         "normal": 152.236
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 12.118000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 12.094000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 3.7460000000000004,
            //                         "normal": 483.74600000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "hydroxyureas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 11.316
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "bypath",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08600000000000001,
            //                         "normal": 20.008000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 441.646
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 423.578
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.978,
            //                         "normal": 422.79600000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 212.75400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 212.75400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 29.962000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 21.488
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 59.08
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 16.512,
            //                         "danger": 0.002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 38.32
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.03,
            //                         "normal": 26.060000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 21.996000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 29.468000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "hydroxyureas",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 6.998000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "hydroxyureas",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 13.176
            //                     }
            //                 },
            //                 {
            //                     "source": "hydroxyureas",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.084,
            //                         "normal": 11.338000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "hydroxyureas",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 8.328000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "overburning",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.036,
            //                         "normal": 165.91
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.028000000000000004,
            //                         "normal": 94.644
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 42.330000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 13.772
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 58.394000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 18.84
            //                     }
            //                 },
            //                 {
            //                     "source": "salvability",
            //                     "target": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.10200000000000001,
            //                         "normal": 94.808
            //                     }
            //                 },
            //                 {
            //                     "source": "methadone",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.2220000000000002,
            //                         "normal": 130.43800000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.072,
            //                         "normal": 584.736
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 9.88
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 11.422
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 60.664
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.10200000000000001,
            //                         "normal": 143.788
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.052000000000000005,
            //                         "normal": 35.242000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.152,
            //                         "normal": 143.71
            //                     }
            //                 },
            //                 {
            //                     "source": "veniremen",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 205.9,
            //                         "danger": 0.052000000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 952.8299999999999
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.9440000000000004,
            //                         "normal": 473.774
            //                     }
            //                 },
            //                 {
            //                     "source": "infectivities",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 19.762
            //                     }
            //                 },
            //                 {
            //                     "source": "commanderies",
            //                     "target": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 4.296,
            //                         "normal": 3108.2200000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "commanderies",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.034,
            //                         "normal": 13.826
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.35200000000000004,
            //                         "normal": 813.974
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.04000000000000001,
            //                         "normal": 51.568
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 432.53000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.782,
            //                         "normal": 107.24400000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.27799999999999997,
            //                         "normal": 1125.488
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.17800000000000002,
            //                         "normal": 1024.164
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.032,
            //                         "normal": 242.24400000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 25.538
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.6120000000000001,
            //                         "normal": 107.134
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.05600000000000001,
            //                         "normal": 204.30200000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.026000000000000002,
            //                         "normal": 87.44200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 10.922
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.17400000000000002,
            //                         "normal": 204.236
            //                     }
            //                 },
            //                 {
            //                     "source": "gradine",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 8.93
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 732.346,
            //                         "danger": 0.126
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 180.482
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.268,
            //                         "normal": 1447.2420000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.042,
            //                         "normal": 82.05000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 110.86400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "remarkableness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.254,
            //                         "normal": 104.708
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.37200000000000005,
            //                         "normal": 1767.798
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 533.23,
            //                         "danger": 0.05
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 281.146
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.828,
            //                         "normal": 279.064
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 37.564
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.028000000000000004,
            //                         "normal": 20.408
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.118,
            //                         "normal": 242.05
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 3.1300000000000003,
            //                         "normal": 821.4280000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.072,
            //                         "normal": 128.96400000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 1814.65,
            //                         "danger": 2.5220000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.7000000000000001,
            //                         "normal": 174.942
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.3820000000000001,
            //                         "normal": 6140.146000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.41600000000000004,
            //                         "normal": 1858.862
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.198,
            //                         "normal": 97.298
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.69,
            //                         "normal": 1827.1240000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 58.584,
            //                         "normal": 10003.208
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 67.046,
            //                         "normal": 4505.166
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.6420000000000003,
            //                         "normal": 647.144
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 9.032,
            //                         "normal": 502.846
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.382,
            //                         "normal": 187.06400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.7420000000000004,
            //                         "normal": 1089.852
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.544,
            //                         "normal": 1640.478
            //                     }
            //                 },
            //                 {
            //                     "source": "uraei",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.04
            //                     }
            //                 },
            //                 {
            //                     "source": "nanuas",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.34,
            //                         "normal": 1742.8400000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "microparasites",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 4.266,
            //                         "normal": 617.72
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 716.644
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 7.944,
            //                         "normal": 1307.4440000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 20.524
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.04000000000000001,
            //                         "normal": 65.924
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.46799999999999997,
            //                         "normal": 65.568
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 278.42600000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "rummlegumptions",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.18600000000000003,
            //                         "normal": 258.168
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.478,
            //                         "normal": 7.978000000000001
            //                     },
            //                     "class": "danger"
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.20800000000000002,
            //                         "normal": 485.086
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 8.76
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.564,
            //                         "normal": 223.76999999999998
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.034,
            //                         "normal": 22.124000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "schemozzling",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 26.160000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "schemozzling",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.286,
            //                         "normal": 6.328
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 414.49399999999997,
            //                         "danger": 0.08000000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 23.726,
            //                         "danger": 0.002
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.45199999999999996,
            //                         "normal": 971.8940000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 68.152,
            //                         "danger": 0.17600000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 4.526,
            //                         "normal": 567.88
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 50.62200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 51.966
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 10.456000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.609999999999999
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.846
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 139.922
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 153.304
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 30.445999999999998
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 21.97
            //                     }
            //                 }
            //             ],
            //             "maxVolume": 96035.538,
            //             "props": {
            //                 "maxSemaphores": [
            //                     {
            //                         "targetRegion": "eu-west-1",
            //                         "region": "us-east-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "us-east-1",
            //                         "value": "200"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "us-west-2",
            //                         "value": "160"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     }
            //                 ]
            //             },
            //             "metadata": {},
            //             "class": "normal"
            //         },
            //         {
            //             "renderer": "region",
            //             "name": "eu-west-1",
            //             "displayName": "EU-WEST-1",
            //             "updated": 1477690450280,
            //             "nodes": [
            //                 {
            //                     "name": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "oceanographic",
            //                             "metrics": {
            //                                 "danger": 51.526,
            //                                 "normal": 21282.100000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "amboceptors",
            //                             "metrics": {
            //                                 "danger": 0.27,
            //                                 "normal": 123.798
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "proxy-prod",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "pitched",
            //                             "metrics": {
            //                                 "danger": 44.784,
            //                                 "normal": 18983.510000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "insightful",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 9106.082
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "natations",
            //                             "metrics": {
            //                                 "danger": 1.6620000000000001,
            //                                 "normal": 4847.258000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lassoing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "haematurias",
            //                             "metrics": {
            //                                 "danger": 4030.91,
            //                                 "normal": 29.980000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "protandries",
            //                             "metrics": {
            //                                 "danger": 1.1560000000000001,
            //                                 "normal": 4089.86
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "traffickers",
            //                             "metrics": {
            //                                 "normal": 3317.3080000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "ikebana",
            //                             "metrics": {
            //                                 "normal": 5524.654
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "slicknesses",
            //                             "metrics": {
            //                                 "danger": 0.016,
            //                                 "normal": 2318.644
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "sicklier",
            //                             "metrics": {
            //                                 "danger": 0.002,
            //                                 "normal": 1810.688
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "virtuosic",
            //                             "metrics": {
            //                                 "normal": 2149.422
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tendu",
            //                             "metrics": {
            //                                 "normal": 1270.272
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "underkeeper",
            //                             "metrics": {
            //                                 "normal": 1151.8700000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "ephors",
            //                             "metrics": {
            //                                 "normal": 1050.978
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "undiscernible",
            //                             "metrics": {
            //                                 "normal": 2014.3700000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "detent",
            //                             "metrics": {
            //                                 "normal": 913.5500000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "italianated",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "davening",
            //                             "metrics": {
            //                                 "normal": 812.89
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "shamas",
            //                             "metrics": {
            //                                 "danger": 0.254,
            //                                 "normal": 2046.296
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "myelocytic",
            //                             "metrics": {
            //                                 "normal": 1807.08
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "macrurous",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "misadapts",
            //                             "metrics": {
            //                                 "danger": 710.6460000000001,
            //                                 "normal": 53.666
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "globalised",
            //                             "metrics": {
            //                                 "normal": 51.006
            //                             }
            //                         },
            //                         {
            //                             "name": "determinants",
            //                             "metrics": {
            //                                 "normal": 51.39600000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "refed",
            //                             "metrics": {
            //                                 "normal": 616.6080000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "unhesitating",
            //                             "metrics": {
            //                                 "danger": 43.526,
            //                                 "normal": 1011.1
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "burramundi",
            //                             "metrics": {
            //                                 "normal": 510.774
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "pucks",
            //                             "metrics": {
            //                                 "normal": 489.39799999999997
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "viticultures",
            //                             "metrics": {
            //                                 "danger": 0.020000000000000004,
            //                                 "normal": 324.78000000000003
            //                             }
            //                         },
            //                         {
            //                             "name": "chado",
            //                             "metrics": {
            //                                 "normal": 20.748
            //                             }
            //                         },
            //                         {
            //                             "name": "plowers",
            //                             "metrics": {
            //                                 "normal": 20.742
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "infallibly",
            //                             "metrics": {
            //                                 "normal": 428.74,
            //                                 "danger": 0.054000000000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "ralphs",
            //                             "metrics": {
            //                                 "danger": 0.010000000000000002,
            //                                 "normal": 372.718
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "martians",
            //                             "metrics": {
            //                                 "normal": 340.39000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "fluorescences",
            //                             "metrics": {
            //                                 "normal": 364.58200000000005,
            //                                 "danger": 0.17400000000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "spitefulnesses",
            //                             "metrics": {
            //                                 "normal": 381.944
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "coenobites",
            //                             "metrics": {
            //                                 "normal": 4.170000000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "mercurialises",
            //                             "metrics": {
            //                                 "danger": 0.17,
            //                                 "normal": 433.778
            //                             }
            //                         },
            //                         {
            //                             "name": "darnations",
            //                             "metrics": {
            //                                 "normal": 4.188000000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "obtainment",
            //                             "metrics": {
            //                                 "normal": 270.09000000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "election",
            //                             "metrics": {
            //                                 "danger": 56.836000000000006,
            //                                 "normal": 194.942
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "dreadlocks",
            //                             "metrics": {
            //                                 "normal": 207.42
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "flashpacker",
            //                             "metrics": {
            //                                 "danger": 0.03,
            //                                 "normal": 468.98800000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "emblazonments",
            //                             "metrics": {
            //                                 "normal": 465.58000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "imbalmers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "prawning",
            //                             "metrics": {
            //                                 "normal": 134.08
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "repulsing",
            //                             "metrics": {
            //                                 "normal": 116.976
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "microparasites",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "dissymmetrical",
            //                             "metrics": {
            //                                 "danger": 0.47400000000000003,
            //                                 "normal": 490.53000000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "choosers",
            //                             "metrics": {
            //                                 "normal": 102.95
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "micropipette",
            //                             "metrics": {
            //                                 "normal": 105.41400000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "rabidness",
            //                             "metrics": {
            //                                 "normal": 11.426000000000002,
            //                                 "danger": 87.786
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "polyparia",
            //                             "metrics": {
            //                                 "danger": 0.03,
            //                                 "normal": 89.00800000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "connectivity",
            //                             "metrics": {
            //                                 "normal": 306.758
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "navicular",
            //                             "metrics": {
            //                                 "normal": 78.39
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "traplike",
            //                             "metrics": {
            //                                 "danger": 1.2800000000000002,
            //                                 "normal": 101.37400000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "pilferer",
            //                             "metrics": {
            //                                 "danger": 0.43600000000000005,
            //                                 "normal": 731.02
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "alignment",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "spaniolizes",
            //                             "metrics": {
            //                                 "normal": 71.76
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tridymites",
            //                             "metrics": {
            //                                 "normal": 55.562000000000005
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "inmeshed",
            //                             "metrics": {
            //                                 "danger": 9.76,
            //                                 "normal": 52.934000000000005
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "poundages",
            //                             "metrics": {
            //                                 "normal": 28.422000000000004,
            //                                 "danger": 23.504
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "tutresses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "turboshafts",
            //                             "metrics": {
            //                                 "danger": 0.018,
            //                                 "normal": 50.884
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "predispositions",
            //                             "metrics": {
            //                                 "normal": 79.25800000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "heniquen",
            //                             "metrics": {
            //                                 "normal": 36.728,
            //                                 "danger": 2.196
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "trawlers",
            //                             "metrics": {
            //                                 "danger": 0.06,
            //                                 "normal": 38.900000000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "superablenesses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "dotcommer",
            //                             "metrics": {}
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "maysterdomes",
            //                             "metrics": {
            //                                 "danger": 0.24,
            //                                 "normal": 30.168000000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "elations",
            //                             "metrics": {
            //                                 "normal": 0.10400000000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "slaters",
            //                             "metrics": {
            //                                 "normal": 0.31600000000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "zygapophysial",
            //                             "metrics": {
            //                                 "danger": 0.024,
            //                                 "normal": 68.312
            //                             }
            //                         },
            //                         {
            //                             "name": "extraforaneous",
            //                             "metrics": {
            //                                 "normal": 4.402
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "neatherd",
            //                             "metrics": {
            //                                 "normal": 61.192
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "astucities",
            //                             "metrics": {
            //                                 "danger": 9.15,
            //                                 "normal": 17.154
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "empyreal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "inselberge",
            //                             "metrics": {
            //                                 "normal": 18.396
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "nephrotoxic",
            //                             "metrics": {}
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "unannoyed",
            //                             "metrics": {
            //                                 "danger": 0.31600000000000006,
            //                                 "normal": 11.586
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "darnel",
            //                             "metrics": {
            //                                 "normal": 12.528
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "stressbuster",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "fisherwomen",
            //                             "metrics": {
            //                                 "normal": 0.11399999999999999
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "atma",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "counterfeit",
            //                             "metrics": {
            //                                 "normal": 170.68
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "name": "INTERNET",
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cleavage",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "panellists"
            //                         },
            //                         {
            //                             "name": "elementalisms",
            //                             "metrics": {
            //                                 "normal": 45.956
            //                             }
            //                         },
            //                         {
            //                             "name": "phosphoric",
            //                             "metrics": {
            //                                 "normal": 45.982
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "appropriable",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "jasmonates",
            //                             "metrics": {
            //                                 "normal": 345.24
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 }
            //             ],
            //             "connections": [
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-prod",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 66.142,
            //                         "normal": 16086.784
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 8.326,
            //                         "normal": 4744.914
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-log",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.5660000000000001,
            //                         "normal": 3838.1540000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "tutresses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "warning": 0.006,
            //                         "danger": 0.006,
            //                         "normal": 48.244
            //                     }
            //                 },
            //                 {
            //                     "source": "quittors",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 49.452
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.034,
            //                         "normal": 30.352
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 30.852
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 17.464
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 36.838
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 15.274000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 52.44
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 53.59400000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 8.8
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.5620000000000003,
            //                         "normal": 3307.696
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 3.598,
            //                         "normal": 728.466
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 52.105999999999995
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 35.568000000000005,
            //                         "danger": 0.020000000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 66.95
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.17600000000000002,
            //                         "normal": 234.21
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 18.152
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 18.152
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 18.152
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.03,
            //                         "normal": 36.598000000000006
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 433.78999999999996
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.462,
            //                         "normal": 38.986000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.192,
            //                         "normal": 224.294
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 25.248,
            //                         "danger": 0.066
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08000000000000002,
            //                         "normal": 108.98800000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 6.332000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 6.332000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 6.332000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "italianated",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.32400000000000007,
            //                         "normal": 865.306
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 13.26,
            //                         "normal": 1007.164
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.248,
            //                         "normal": 356.504
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 54.518
            //                     }
            //                 },
            //                 {
            //                     "source": "cylindricalness",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 15.032
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.016,
            //                         "normal": 94.428
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.516
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.7280000000000002,
            //                         "normal": 269.614
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.11599999999999999,
            //                         "normal": 466.20000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.10600000000000001,
            //                         "normal": 501.17600000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 78.14
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 10.608
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.036,
            //                         "normal": 53.462
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 79.578
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 35.508
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 79.57600000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 180.454
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 171.734
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.32400000000000007,
            //                         "normal": 171.44000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 296.514,
            //                         "danger": 0.068
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 28.724000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 11.556000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 55.632000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 8.468000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 31.416000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 12.498000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 11.870000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 14.068000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "tutresses",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08800000000000001,
            //                         "normal": 47.882000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 18.924000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 16.662000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.046000000000000006,
            //                         "normal": 346.98600000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 95.14600000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.202,
            //                         "normal": 966.808
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 34.796
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 74.53200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.422,
            //                         "normal": 48.504000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.128,
            //                         "normal": 903.142
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 294.858,
            //                         "danger": 0.142
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "empyreal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 16.416
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 100.72000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 105.006
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 18.150000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 10.318000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.042,
            //                         "normal": 119.562
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 15.034
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 427.89
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 86.78800000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.092,
            //                         "normal": 1076.2920000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.564,
            //                         "normal": 68.38600000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.866,
            //                         "normal": 3333.9580000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 1147.178
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.10400000000000001,
            //                         "normal": 53.804
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 9.162,
            //                         "normal": 1238.498
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 4.720000000000001,
            //                         "normal": 5490.286
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 11.666,
            //                         "normal": 2459.642
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.22999999999999998,
            //                         "normal": 304.594
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 393.14200000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.032,
            //                         "normal": 120.03399999999999
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.057999999999999996,
            //                         "normal": 499.932
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.338,
            //                         "normal": 644.3820000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "overburning",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 38.458
            //                     }
            //                 },
            //                 {
            //                     "source": "uraei",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.044000000000000004,
            //                         "normal": 152.102
            //                     }
            //                 },
            //                 {
            //                     "source": "nanuas",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.15600000000000003,
            //                         "normal": 904.082
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 47.308
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 21.118000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 25.586000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 8.518
            //                     }
            //                 },
            //                 {
            //                     "source": "microparasites",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.108,
            //                         "normal": 368.564
            //                     }
            //                 },
            //                 {
            //                     "source": "salvability",
            //                     "target": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.026000000000000002,
            //                         "normal": 38.728
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 295.798
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08600000000000001,
            //                         "normal": 578.22
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 13.282
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 31.977999999999998
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.21800000000000003,
            //                         "normal": 31.718000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.194,
            //                         "normal": 128.91
            //                     }
            //                 },
            //                 {
            //                     "source": "methadone",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.6120000000000001,
            //                         "normal": 88.91000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.094,
            //                         "normal": 549.4720000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 19.596000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.046000000000000006,
            //                         "normal": 68.16000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.024,
            //                         "normal": 21.134
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.328,
            //                         "normal": 68.16799999999999
            //                     }
            //                 },
            //                 {
            //                     "source": "veniremen",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 105.46800000000002,
            //                         "danger": 0.026000000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "rummlegumptions",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 165.952
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.12,
            //                         "normal": 396.09200000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.026000000000000002,
            //                         "normal": 227.73400000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 222.92399999999998
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.4660000000000002,
            //                         "normal": 153.282
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 11.554000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "infectivities",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 9.794
            //                     }
            //                 },
            //                 {
            //                     "source": "schemozzling",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 7.526000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.15200000000000002,
            //                         "normal": 370.10200000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 16.908
            //                     }
            //                 },
            //                 {
            //                     "source": "commanderies",
            //                     "target": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.8119999999999999,
            //                         "normal": 1858.18
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 214.48600000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 10.4
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.294,
            //                         "normal": 429.02
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.328,
            //                         "normal": 58.42000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.4800000000000002,
            //                         "normal": 215.53400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.412000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 83.342
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 31.422000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "superablenesses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 31.422000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 9.698
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "stressbuster",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 9.698
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 6.6000000000000005
            //                     }
            //                 }
            //             ],
            //             "maxVolume": 73535.998,
            //             "props": {
            //                 "maxSemaphores": [
            //                     {
            //                         "targetRegion": "eu-west-1",
            //                         "region": "us-east-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "us-west-2",
            //                         "value": "160"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "us-east-1",
            //                         "value": "200"
            //                     }
            //                 ]
            //             },
            //             "metadata": {},
            //             "class": "normal"
            //         },
            //         {
            //             "renderer": "region",
            //             "name": "us-west-2",
            //             "displayName": "US-WEST-2",
            //             "updated": 1477690452072,
            //             "nodes": [
            //                 {
            //                     "name": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "heterostylism",
            //                             "metrics": {
            //                                 "danger": 59.724000000000004,
            //                                 "normal": 26213.520000000004
            //                             }
            //                         },
            //                         {
            //                             "name": "bulimies"
            //                         },
            //                         {
            //                             "name": "neurosecretory",
            //                             "metrics": {
            //                                 "danger": 0.244,
            //                                 "normal": 121.258
            //                             }
            //                         },
            //                         {
            //                             "name": "sensualisation",
            //                             "metrics": {
            //                                 "danger": 0.26,
            //                                 "normal": 121.14000000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "soppiest",
            //                             "metrics": {
            //                                 "danger": 0.31000000000000005,
            //                                 "normal": 120.69800000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "postop",
            //                             "metrics": {
            //                                 "danger": 0.264,
            //                                 "normal": 121.20400000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "magisteries",
            //                             "metrics": {
            //                                 "danger": 0.2,
            //                                 "normal": 107.31800000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "miraculous",
            //                             "metrics": {
            //                                 "danger": 0.30000000000000004,
            //                                 "normal": 120.54000000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "sneeing"
            //                         },
            //                         {
            //                             "name": "iridisations",
            //                             "metrics": {
            //                                 "danger": 0.064,
            //                                 "normal": 39.858000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "proxy-prod",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "conveyorized",
            //                             "metrics": {
            //                                 "danger": 15.376,
            //                                 "normal": 22666.646
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "stromatic",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 11166.348
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "chicnesses",
            //                             "metrics": {
            //                                 "danger": 2.7840000000000003,
            //                                 "normal": 6895.146000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lassoing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "uncurbing",
            //                             "metrics": {
            //                                 "danger": 5158.32,
            //                                 "normal": 61.754
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "whoobubs",
            //                             "metrics": {
            //                                 "normal": 4052.878
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "quahogs",
            //                             "metrics": {
            //                                 "danger": 0.034,
            //                                 "normal": 4510.330000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tawdry",
            //                             "metrics": {
            //                                 "normal": 2786.2900000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "starfucking",
            //                             "metrics": {
            //                                 "normal": 2196.164
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "transfigurations",
            //                             "metrics": {
            //                                 "danger": 0.05600000000000001,
            //                                 "normal": 1924.698
            //                             }
            //                         },
            //                         {
            //                             "name": "pignoli",
            //                             "metrics": {
            //                                 "normal": 17.058000000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "substraction",
            //                             "metrics": {
            //                                 "normal": 2260.9860000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "hooliganisms",
            //                             "metrics": {
            //                                 "normal": 2663.9660000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "macrurous",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "crosslinguistically",
            //                             "metrics": {
            //                                 "danger": 1240.9440000000002,
            //                                 "normal": 97.93200000000002
            //                             }
            //                         },
            //                         {
            //                             "name": "polarizing",
            //                             "metrics": {
            //                                 "normal": 0.134
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cansticks",
            //                             "metrics": {
            //                                 "normal": 1316.9740000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cartelised",
            //                             "metrics": {
            //                                 "normal": 2530.6360000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "numerological",
            //                             "metrics": {
            //                                 "danger": 0.10600000000000001,
            //                                 "normal": 2744.8080000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "preachers",
            //                             "metrics": {
            //                                 "normal": 1134.912
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "toxocara",
            //                             "metrics": {
            //                                 "normal": 836.822
            //                             }
            //                         },
            //                         {
            //                             "name": "apotheosising",
            //                             "metrics": {
            //                                 "normal": 61.148
            //                             }
            //                         },
            //                         {
            //                             "name": "gyrocars",
            //                             "metrics": {
            //                                 "normal": 60.970000000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "blueliners",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 957.1020000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "italianated",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "disseminated",
            //                             "metrics": {
            //                                 "normal": 941.89
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "macerative",
            //                             "metrics": {
            //                                 "normal": 835.7620000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "reactuated",
            //                             "metrics": {
            //                                 "danger": 4.586,
            //                                 "normal": 1277.366
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "sambhurs",
            //                             "metrics": {
            //                                 "normal": 657.5340000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "microinstruction",
            //                             "metrics": {
            //                                 "normal": 623.392
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "demast",
            //                             "metrics": {
            //                                 "normal": 660.5140000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "vowelizing",
            //                             "metrics": {
            //                                 "normal": 502.378,
            //                                 "danger": 0.066
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "chylomicrons",
            //                             "metrics": {
            //                                 "normal": 630.312
            //                             }
            //                         },
            //                         {
            //                             "name": "dionysiac",
            //                             "metrics": {
            //                                 "normal": 6.456
            //                             }
            //                         },
            //                         {
            //                             "name": "escheatage",
            //                             "metrics": {
            //                                 "normal": 6.4
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "dockside",
            //                             "metrics": {
            //                                 "danger": 0.012,
            //                                 "normal": 441.498
            //                             }
            //                         },
            //                         {
            //                             "name": "athetesis",
            //                             "metrics": {
            //                                 "normal": 12.48
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "graveling",
            //                             "metrics": {
            //                                 "normal": 514.494
            //                             }
            //                         },
            //                         {
            //                             "name": "casebooks",
            //                             "metrics": {
            //                                 "normal": 23.912000000000003
            //                             }
            //                         },
            //                         {
            //                             "name": "parallelism",
            //                             "metrics": {
            //                                 "normal": 23.866
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "arrishes",
            //                             "metrics": {
            //                                 "normal": 348.108
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "organophosphoruses",
            //                             "metrics": {
            //                                 "normal": 340.05
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "designation",
            //                             "metrics": {
            //                                 "normal": 333.002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "tucked",
            //                             "metrics": {
            //                                 "danger": 0.024,
            //                                 "normal": 712.1320000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "calefactors",
            //                             "metrics": {
            //                                 "danger": 38.046,
            //                                 "normal": 340.51800000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "overdoers",
            //                             "metrics": {
            //                                 "normal": 277.372
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "roars",
            //                             "metrics": {
            //                                 "normal": 798.738
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "redsear",
            //                             "metrics": {
            //                                 "normal": 281.23400000000004,
            //                                 "danger": 0.004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "mismeet",
            //                             "metrics": {
            //                                 "normal": 234.268
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "imbalmers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "zaires",
            //                             "metrics": {
            //                                 "normal": 187.678
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "tutresses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "irrationalness",
            //                             "metrics": {
            //                                 "danger": 0.084,
            //                                 "normal": 174.484
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "lanital",
            //                             "metrics": {
            //                                 "danger": 0.37000000000000005,
            //                                 "normal": 225.03600000000003
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "publically",
            //                             "metrics": {
            //                                 "normal": 34.78,
            //                                 "danger": 113.404
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "cooldown",
            //                             "metrics": {
            //                                 "normal": 137.452
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "alignment",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "homalographic",
            //                             "metrics": {
            //                                 "normal": 129.872
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "fussing",
            //                             "metrics": {
            //                                 "danger": 7.006,
            //                                 "normal": 121.08800000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "angelica",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 115.654
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "microparasites",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "autoionizations",
            //                             "metrics": {
            //                                 "danger": 0.7240000000000001,
            //                                 "normal": 442.1600000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "bani",
            //                             "metrics": {
            //                                 "normal": 108.54200000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "staircases",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "askances",
            //                             "metrics": {
            //                                 "normal": 82.15800000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "bankit",
            //                             "metrics": {
            //                                 "normal": 128.31
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "doublespeaks",
            //                             "metrics": {
            //                                 "normal": 68.102,
            //                                 "danger": 18.11
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "karroos",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "zanies",
            //                             "metrics": {
            //                                 "danger": 0.8160000000000001,
            //                                 "normal": 77.23200000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "remarkableness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "coft",
            //                             "metrics": {
            //                                 "danger": 0.094,
            //                                 "normal": 72.884
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "filagrees",
            //                             "metrics": {
            //                                 "danger": 0.016,
            //                                 "normal": 58.355999999999995
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "superablenesses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "vigilantness",
            //                             "metrics": {
            //                                 "normal": 0.17800000000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "alterably",
            //                             "metrics": {
            //                                 "normal": 48.21600000000001,
            //                                 "danger": 2.0260000000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "galivanted",
            //                             "metrics": {
            //                                 "danger": 0.054000000000000006,
            //                                 "normal": 49.332
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "unauthoritative",
            //                             "metrics": {
            //                                 "normal": 48.772000000000006
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "aristocrats",
            //                             "metrics": {
            //                                 "normal": 36.72
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "intergraded",
            //                             "metrics": {
            //                                 "danger": 0.27,
            //                                 "normal": 31.28
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "spiraling",
            //                             "metrics": {
            //                                 "normal": 0.398
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "plantar",
            //                             "metrics": {
            //                                 "normal": 0.128
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "perfecting",
            //                             "metrics": {
            //                                 "danger": 0.004,
            //                                 "normal": 8.906
            //                             }
            //                         },
            //                         {
            //                             "name": "satirizes",
            //                             "metrics": {
            //                                 "danger": 0.016,
            //                                 "normal": 86.33200000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "rough",
            //                             "metrics": {
            //                                 "danger": 9.39,
            //                                 "normal": 20.514
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "emulsible",
            //                             "metrics": {}
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "killocks",
            //                             "metrics": {
            //                                 "normal": 723.1640000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "celluloid",
            //                             "metrics": {
            //                                 "danger": 0.38,
            //                                 "normal": 12.568000000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "groining",
            //                             "metrics": {
            //                                 "normal": 11.674
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "empyreal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "diazoles",
            //                             "metrics": {
            //                                 "normal": 15.904
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "stressbuster",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "foretokening",
            //                             "metrics": {
            //                                 "normal": 0.24
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "hydroxyureas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "attolaser",
            //                             "metrics": {
            //                                 "normal": 7.07
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "atma",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "wadmoll",
            //                             "metrics": {
            //                                 "normal": 275.08000000000004
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "cleavage",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "apostrophuses"
            //                         },
            //                         {
            //                             "name": "undeserts",
            //                             "metrics": {
            //                                 "normal": 52.18600000000001
            //                             }
            //                         },
            //                         {
            //                             "name": "powerboat",
            //                             "metrics": {
            //                                 "danger": 0.006,
            //                                 "normal": 51.92000000000001
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [],
            //                     "name": "INTERNET",
            //                     "renderer": "focusedChild"
            //                 },
            //                 {
            //                     "name": "appropriable",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "nodes": [
            //                         {
            //                             "name": "lycanthropy",
            //                             "metrics": {
            //                                 "normal": 309.84400000000005,
            //                                 "danger": 0.014000000000000002
            //                             }
            //                         }
            //                     ],
            //                     "renderer": "focusedChild"
            //                 }
            //             ],
            //             "connections": [
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-prod",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "warning": 0.9199999999999999,
            //                         "danger": 55.14600000000001,
            //                         "normal": 21140.684
            //                     },
            //                     "notices": [
            //                         {
            //                             "title": "CPU usage average at 80%",
            //                             "link": "http://link/to/relevant/thing",
            //                             "severity": 1
            //                         },
            //                         {
            //                             "title": "Reticulating splines"
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "buglers",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 13.784,
            //                         "normal": 6613.036
            //                     }
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "proxy-log",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.7280000000000001,
            //                         "normal": 5332.1140000000005
            //                     },
            //                     "notices": [
            //                         {
            //                             "title": "Bob Loblaws law blog logging log blobs",
            //                             "link": "http://link/to/relevant/thing"
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "source": "INTERNET",
            //                     "target": "tutresses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.068,
            //                         "normal": 171.41400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "quittors",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.018,
            //                         "normal": 39.846000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 32.126,
            //                         "danger": 0.010000000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.028000000000000004,
            //                         "normal": 32.202
            //                     }
            //                 },
            //                 {
            //                     "source": "accounts",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 101.02000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "nicompoops",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 20.258000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "playlisted",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 44.644000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "reoxidize",
            //                     "target": "precited",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 17.822
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 95.41000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "cylindricalness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 119.498
            //                     }
            //                 },
            //                 {
            //                     "source": "unapproachabilities",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.644
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 13.36
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 6.364000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 22.744,
            //                         "normal": 4113.168000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "lassoing",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 13.238,
            //                         "normal": 1003.356
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 9.342
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 87.626
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 75.652,
            //                         "danger": 0.006
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.036,
            //                         "normal": 97.138
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 346.36
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "rummlegumptions",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 24.578000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overdosed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 24.578000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "corfhouses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 24.578000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.062,
            //                         "normal": 58.92400000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.04000000000000001,
            //                         "normal": 9.144
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.018,
            //                         "normal": 542.3760000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.246,
            //                         "normal": 73.64
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.7480000000000002,
            //                         "normal": 334.97800000000007
            //                     }
            //                 },
            //                 {
            //                     "source": "macrurous",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08800000000000001,
            //                         "normal": 32.244
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 18.080000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 18.61
            //                     }
            //                 },
            //                 {
            //                     "source": "karroos",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 19.798000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 177.306
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "italianated",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08600000000000001,
            //                         "normal": 940.0680000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "perfectibilians",
            //                     "target": "overburning",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.406,
            //                         "normal": 1167.598
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 195.93800000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "relocator",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 53.114000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "cylindricalness",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 52.742
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.034,
            //                         "normal": 92.37200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 8.22
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 10.394
            //                     }
            //                 },
            //                 {
            //                     "source": "arabesk",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.7160000000000002,
            //                         "normal": 284.696
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.238,
            //                         "normal": 796.37
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.13799999999999998,
            //                         "normal": 700.244
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 3.204,
            //                         "normal": 301.242
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 18.232
            //                     }
            //                 },
            //                 {
            //                     "source": "profulgent",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.128,
            //                         "normal": 74.742
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.057999999999999996,
            //                         "normal": 128.014
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 52.93200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.11399999999999999,
            //                         "normal": 9.628
            //                     }
            //                 },
            //                 {
            //                     "source": "gerents",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.012,
            //                         "normal": 128.032
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 280.106
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "profulgent",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.014000000000000002,
            //                         "normal": 270.362
            //                     }
            //                 },
            //                 {
            //                     "source": "atma",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.754,
            //                         "normal": 269.712
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 245.572
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 22.886000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "kaoliangs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.666
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "lycee",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 44.31
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.95,
            //                         "danger": 0.004
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 25.866000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 10.022
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.918000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "commerce",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 12.932
            //                     }
            //                 },
            //                 {
            //                     "source": "tutresses",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.192,
            //                         "normal": 168.186
            //                     }
            //                 },
            //                 {
            //                     "source": "staircases",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.1,
            //                         "normal": 79.14800000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 31.208
            //                     }
            //                 },
            //                 {
            //                     "source": "cleavage",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 32.018
            //                     }
            //                 },
            //                 {
            //                     "source": "hydroxyureas",
            //                     "target": "schemozzling",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 6.6819999999999995
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.134,
            //                         "normal": 514.4540000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "compellation",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 140.268
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.252,
            //                         "normal": 782.778
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 60.098000000000006
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 62.11000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "remarkableness",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.08600000000000001,
            //                         "normal": 66.108
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "nanuas",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 6.16,
            //                         "normal": 830.7840000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "semitropics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 399.80600000000004,
            //                         "danger": 0.038000000000000006
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "empyreal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.036
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "blastodiscs",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 133.056
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "prickliest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.166,
            //                         "normal": 266.03000000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 25.310000000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "priviest",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.816
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.10600000000000001,
            //                         "normal": 134.934
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 13.328000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "arabesk",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 410.144
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "methadone",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 57.954
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "perfectibilians",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.5700000000000001,
            //                         "normal": 1303.3360000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "multiracialisms",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.492,
            //                         "normal": 132.894
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.414,
            //                         "normal": 3535.66
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "commanderies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.07800000000000001,
            //                         "normal": 1105.906
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "gainfully",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.052000000000000005,
            //                         "normal": 61.874
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "malvasias",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.27599999999999997,
            //                         "normal": 945.338
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "foetal",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 36.184,
            //                         "normal": 6641.012
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 37.192,
            //                         "normal": 2877.512
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "legwork",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.786,
            //                         "normal": 419.77
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "relocator",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 234.27600000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "brazed",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 96.80000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "unapproachabilities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.020000000000000004,
            //                         "normal": 641.096
            //                     }
            //                 },
            //                 {
            //                     "source": "viraemic",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.12,
            //                         "normal": 1090.724
            //                     }
            //                 },
            //                 {
            //                     "source": "overburning",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.022000000000000002,
            //                         "normal": 74.956
            //                     }
            //                 },
            //                 {
            //                     "source": "nanuas",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 818.2760000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "shidduchim",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 49.242000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "accounts",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 19.75
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "salvability",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 7.126000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "commerce",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 38.438
            //                     }
            //                 },
            //                 {
            //                     "source": "priviest",
            //                     "target": "hounding",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.358
            //                     }
            //                 },
            //                 {
            //                     "source": "microparasites",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.4160000000000001,
            //                         "normal": 317.36400000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "salvability",
            //                     "target": "reoxidize",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.048,
            //                         "normal": 47.370000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 432.442
            //                     }
            //                 },
            //                 {
            //                     "source": "foetal",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.18400000000000002,
            //                         "normal": 860.5840000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.008,
            //                         "normal": 11.082
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 38.434
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.22599999999999998,
            //                         "normal": 38.294000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "imbalmers",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 180.476
            //                     }
            //                 },
            //                 {
            //                     "source": "methadone",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.44400000000000006,
            //                         "normal": 58.24400000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.064,
            //                         "normal": 280.04
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 6.566
            //                     }
            //                 },
            //                 {
            //                     "source": "malvasias",
            //                     "target": "uraei",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.21200000000000002,
            //                         "normal": 10.708
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 51.422000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "viraemic",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.032,
            //                         "normal": 121.39200000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.744
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "immedicably",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.018,
            //                         "normal": 28.939999999999998
            //                     }
            //                 },
            //                 {
            //                     "source": "alignment",
            //                     "target": "neuritics",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.594,
            //                         "normal": 121.43
            //                     }
            //                 },
            //                 {
            //                     "source": "veniremen",
            //                     "target": "disseat",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 116.36800000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "rummlegumptions",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.026000000000000002,
            //                         "normal": 200.15
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "disenthral",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 581.86
            //                     }
            //                 },
            //                 {
            //                     "source": "neuritics",
            //                     "target": "yuppifies",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.054000000000000006,
            //                         "normal": 245.97600000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "tanrec",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 353.266
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "infectivities",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.52,
            //                         "normal": 161.19600000000003
            //                     }
            //                 },
            //                 {
            //                     "source": "semitropics",
            //                     "target": "previsionary",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.006,
            //                         "normal": 12.89
            //                     }
            //                 },
            //                 {
            //                     "source": "infectivities",
            //                     "target": "spuds",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 9.598
            //                     }
            //                 },
            //                 {
            //                     "source": "schemozzling",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.004,
            //                         "normal": 7.698
            //                     }
            //                 },
            //                 {
            //                     "source": "schemozzling",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.038000000000000006,
            //                         "normal": 6.098
            //                     }
            //                 },
            //                 {
            //                     "source": "commanderies",
            //                     "target": "wickyups",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 2.5620000000000003,
            //                         "normal": 1925.06
            //                     }
            //                 },
            //                 {
            //                     "source": "commanderies",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.016,
            //                         "normal": 12.534
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "mispricing",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.774,
            //                         "normal": 444.76000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "gainfully",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.010000000000000002,
            //                         "normal": 33.816
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "risks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.066,
            //                         "normal": 230.00400000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "concatenates",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 12.844000000000001
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "veniremen",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.398,
            //                         "normal": 582.24
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.11200000000000002,
            //                         "normal": 38.684
            //                     }
            //                 },
            //                 {
            //                     "source": "majordomo",
            //                     "target": "quittors",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 1.722,
            //                         "normal": 305.412
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "oiks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 6.2540000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "proletarianised",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 99.68200000000002
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "gerents",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 48.038000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "superablenesses",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 48.038000000000004
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "stressbuster",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.8580000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "majordomo",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "normal": 7.8580000000000005
            //                     }
            //                 },
            //                 {
            //                     "source": "appropriable",
            //                     "target": "parrocks",
            //                     "metadata": {
            //                         "streaming": 1
            //                     },
            //                     "metrics": {
            //                         "danger": 0.002,
            //                         "normal": 14.768
            //                     }
            //                 }
            //             ],
            //             "maxVolume": 67936.982,
            //             "props": {
            //                 "maxSemaphores": [
            //                     {
            //                         "targetRegion": "eu-west-1",
            //                         "region": "us-east-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "us-west-2",
            //                         "value": "160"
            //                     },
            //                     {
            //                         "targetRegion": "us-east-1",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "eu-west-1",
            //                         "value": "20"
            //                     },
            //                     {
            //                         "targetRegion": "us-west-2",
            //                         "region": "us-east-1",
            //                         "value": "200"
            //                     }
            //                 ]
            //             },
            //             "metadata": {},
            //             "class": "normal"
            //         }
            //     ],
            //     "connections": [
            //         {
            //             "source": "INTERNET",
            //             "target": "us-west-2",
            //             "metrics": {
            //                 "normal": 38716.976,
            //                 "danger": 76.896,
            //                 "warning": 0.96
            //             },
            //             "notices": [],
            //             "class": "normal"
            //         },
            //         {
            //             "source": "INTERNET",
            //             "target": "us-east-1",
            //             "metrics": {
            //                 "danger": 130.71200000000002,
            //                 "normal": 63139.416,
            //                 "warning": 0.10200000000000001
            //             },
            //             "notices": [],
            //             "class": "normal"
            //         },
            //         {
            //             "source": "INTERNET",
            //             "target": "eu-west-1",
            //             "metrics": {
            //                 "normal": 31464.322000000004,
            //                 "danger": 97.60600000000001,
            //                 "warning": 0.006
            //             },
            //             "notices": [],
            //             "class": "normal"
            //         },
            //         {
            //             "source": "eu-west-1",
            //             "target": "us-east-1",
            //             "metrics": {}
            //         },
            //         {
            //             "source": "eu-west-1",
            //             "target": "us-west-2",
            //             "metrics": {}
            //         },
            //         {
            //             "source": "us-west-2",
            //             "target": "us-east-1",
            //             "metrics": {
            //                 "normal": 0.024
            //             }
            //         },
            //         {
            //             "source": "us-west-2",
            //             "target": "eu-west-1",
            //             "metrics": {
            //                 "danger": 0.004,
            //                 "normal": 0.19200000000000006
            //             }
            //         },
            //         {
            //             "source": "us-east-1",
            //             "target": "eu-west-1",
            //             "metrics": {
            //                 "normal": 0.16800000000000004
            //             }
            //         },
            //         {
            //             "source": "us-east-1",
            //             "target": "us-west-2",
            //             "metrics": {
            //                 "normal": 0.07
            //             }
            //         }
            //     ],
            //     "serverUpdateTime": 1477691777441
            // },
            // trafficData: {
            //     renderer: 'global',
            //     name: 'edge',
            //     nodes: [
            //         {
            //             "renderer": "region",
            //             "name": "ala",
            //             "displayName": "test machine 1",
            //             "nodes": [],
            //             "metadata": {},
            //             "class": "normal",
            //             "connections": []
            //         },
            //         {
            //             "renderer": "region",
            //             "name": "kota",
            //             "displayName": "test machine 2",
            //             "nodes": [],
            //             "metadata": {},
            //             "class": "normal",
            //             "connections": []
            //         },
            //     ],
            //     connections: [
            //         {
            //             "source": "ala",
            //             "target": "kota",
            //             "metrics": {
            //                 // "normal": 1,
            //                 // "danger": 0,
            //                 // "warning": 0
            //             },
            //             "notices": [],
            //             "class": "normal"
            //         },
            //     ],
            //     serverUpdateTime: 1477691777441
            // },
            regionUpdateStatus: [],
            timeOffset: 0,
            modes: {
                detailedNode: 'volume'
            }
        };
    }

    viewChanged = (data) => {
        const changedState = {
            currentView: data.view,
            searchTerm: '',
            matches: { total: -1, visible: -1 },
            redirectedFrom: data.redirectedFrom
        };
        if (hasOwnPropFunc.call(data, 'graph')) {
            let oldCurrentGraph = this.state.currentGraph;
            if (oldCurrentGraph == null) oldCurrentGraph = null;
            let newCurrentGraph = data.graph;
            if (newCurrentGraph == null) newCurrentGraph = null;
            if (oldCurrentGraph !== newCurrentGraph) {
                changedState.currentGraph = newCurrentGraph;
                const o = newCurrentGraph === null ? null : newCurrentGraph.getPhysicsOptions();
                changedState.currentGraph_physicsOptions = o;
            }
        }
        this.setState(changedState);
    };

    viewUpdated = () => {
        this.setState({});
    };

    objectHighlighted = (highlightedObject) => {
        // need to set objectToHighlight for diffing on the react component. since it was already highlighted here, it will be a noop
        this.setState({
            highlightedObject: highlightedObject, objectToHighlight: highlightedObject ? highlightedObject.getName() : undefined, searchTerm: '', matches: { total: -1, visible: -1 }, redirectedFrom: undefined
        });
    };

    nodeContextSizeChanged = (dimensions) => {
        this.setState({ labelDimensions: dimensions });
    };

    checkInitialRoute () {
        // Check the location bar for any direct routing information
        const pathArray = window.location.pathname.split('/');
        const currentView = [];
        if (pathArray[1]) {
            currentView.push(pathArray[1]);
            if (pathArray[2]) {
                currentView.push(pathArray[2]);
            }
        }
        const parsedQuery = queryString.parse(window.location.search);

        this.setState({ currentView: currentView, objectToHighlight: parsedQuery.highlighted });
    }

    componentDidMount () {
        this.checkInitialRoute();
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (!this.state.currentView
            || this.state.currentView[0] !== nextState.currentView[0]
            || this.state.currentView[1] !== nextState.currentView[1]
            || this.state.highlightedObject !== nextState.highlightedObject
        ) {
            const titleArray = (nextState.currentView || []).slice(0);
            titleArray.unshift('Vizceral');
            document.title = titleArray.join(' / ');

            if (this.poppedState) {
                this.poppedState = false;
            } else if (nextState.currentView) {
                const highlightedObjectName = nextState.highlightedObject && nextState.highlightedObject.getName();
                const state = {
                    title: document.title,
                    url: nextState.currentView.join('/') + (highlightedObjectName ? `?highlighted=${highlightedObjectName}` : ''),
                    selected: nextState.currentView,
                    highlighted: highlightedObjectName
                };
                window.history.pushState(state, state.title, state.url);
            }
        }
        return true;
    }

    updateData (newTraffic) {
        const regionUpdateStatus = _.map(
            _.filter(
                newTraffic.nodes, n => n.name !== 'INTERNET'),
                node => ({ region: node.name, updated: node.updated }),
        );
        const lastUpdatedTime = _.max(_.map(regionUpdateStatus, 'updated'));

        this.setState({
            regionUpdateStatus: regionUpdateStatus,
            timeOffset: newTraffic.clientUpdateTime - newTraffic.serverUpdateTime,
            lastUpdatedTime: lastUpdatedTime,
            trafficData: newTraffic
        });
    }

    isSelectedNode () {
        return this.state.currentView && this.state.currentView[1] !== undefined;
    }

    zoomCallback = () => {
        const currentView = _.clone(this.state.currentView);
        if (currentView.length === 1 && this.state.focusedNode) {
            currentView.push(this.state.focusedNode.name);
        } else if (currentView.length === 2) {
            currentView.pop();
        }
        this.setState({ currentView: currentView });
    }

    detailsClosed = () => {
        // If there is a selected node, deselect the node
        if (this.isSelectedNode()) {
            this.setState({ currentView: [this.state.currentView[0]] });
        } else {
            // If there is just a detailed node, remove the detailed node.
            this.setState({ focusedNode: undefined, highlightedObject: undefined });
        }
    };

    matchesFound = (matches) => {
        this.setState({ matches: matches });
    };

    nodeClicked = (node) => {
        if (this.state.currentView.length === 1) {
            // highlight node
            this.setState({ objectToHighlight: node.getName() });
        } else if (this.state.currentView.length === 2) {
            // detailed view of node
            this.setState({ currentView: [this.state.currentView[0], node.getName()] });
        }
    };

    render () {
        const globalView = this.state.currentView && this.state.currentView.length === 0;
        const nodeView = !globalView && this.state.currentView && this.state.currentView[1] !== undefined;
        let nodeToShowDetails = this.state.currentGraph && this.state.currentGraph.focusedNode;
        nodeToShowDetails = nodeToShowDetails || (this.state.highlightedObject && this.state.highlightedObject.type === 'node' ? this.state.highlightedObject : undefined);
        const connectionToShowDetails = this.state.highlightedObject && this.state.highlightedObject.type === 'connection' ? this.state.highlightedObject : undefined;

        const { definitions, trafficData } = this.props;
        console.log(definitions)

        return (
            <div className="vizceral-container">
                <div className="service-traffic-map">
                    <div style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '240px',
                    }}>
                        <Vizceral traffic={trafficData}
                                  definitions={definitions}
                                  view={this.state.currentView}
                                  showLabels={this.state.displayOptions.showLabels}
                                  filters={this.state.filters}
                                  viewChanged={this.viewChanged}
                                  viewUpdated={this.viewUpdated}
                                  objectHighlighted={this.objectHighlighted}
                                  nodeContextSizeChanged={this.nodeContextSizeChanged}
                                  objectToHighlight={this.state.objectToHighlight}
                                  matchesFound={this.matchesFound}
                                  match={this.state.searchTerm}
                                  modes={this.state.modes}
                                  allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes}
                                  updateData={this.updateData}
                        />
                    </div>
                    {
                        !!nodeToShowDetails
                        && <DetailsPanelNode node={nodeToShowDetails}
                                             nodeSelected={nodeView}
                                             region={this.state.currentView[0]}
                                             width={panelWidth}
                                             zoomCallback={this.zoomCallback}
                                             closeCallback={this.detailsClosed}
                                             nodeClicked={node => this.nodeClicked(node)}
                        />
                    }
                    {
                        !!connectionToShowDetails
                        && <DetailsPanelConnection connection={connectionToShowDetails}
                                                   region={this.state.currentView[0]}
                                                   width={panelWidth}
                                                   closeCallback={this.detailsClosed}
                                                   nodeClicked={node => this.nodeClicked(node)}
                        />
                    }
                </div>
            </div>
        );
    }
}

ModelGraph.propTypes = {};
ModelGraph.defaultProps = {};

export default ModelGraph;
