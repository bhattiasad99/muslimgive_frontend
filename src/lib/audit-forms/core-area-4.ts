import { FormDefinition } from './types';

export const CORE_AREA_4_FORMS: FormDefinition[] = [
    {
        "id": "970b24cd-9332-407b-9310-9c73d198dc15",
        "title": "Governance & Leadership Assessment (CAN)",
        "version": 1,
        "countryCode": "canada",
        "scoreLogic": null,
        "rubric": {
            "id": "f3dca0a9-55c9-4a0c-844d-ab165bad0a81",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "e74d33fd-7500-439c-ac23-e994060e6198",
                "code": "G01",
                "label": "Board Members’ Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "1741fddc-1c97-46f5-83d0-cd33481a4d41",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "3d63d6e6-27d6-41f9-ba4b-71df2f3e92a0",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "dda30f30-dc9e-4939-b159-78d843cc75e2",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "85a095e8-3b73-45ae-8122-26d3fbdaaae0",
                "code": "G02",
                "label": "Board Members’ Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "3f417a2c-a316-4b0e-b5fd-711ecd9385b3",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "c02a988a-1f9c-4727-a1d0-7eca5ef9c691",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "8e4d3091-0a89-4d10-9884-812d3255cb55",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "1ffa7c1a-13e9-4065-aacb-a7cf1cc9cecf",
                "code": "G03",
                "label": "Leadership Team Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "09c367a9-6498-4b43-a68d-5052ab51164b",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "75e90c2e-6ae6-4e93-aaf9-158962da5784",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "9b76d4a3-fd99-4b6e-b3f5-77a185dfe020",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "eb85c48f-7cfa-4e2f-8133-9354fb3696ee",
                "code": "G04",
                "label": "Leadership Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "af141fb9-768a-42fc-9cf9-f8e5265c3cba",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "883829d5-af7f-45aa-aed8-4f67bc52d7bf",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "198607ae-47bf-45a3-9db2-43af2ae3914d",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "034e7c63-11c1-4875-9dbc-bd8191b2132e",
                "code": "G05",
                "label": "Minimum 3 Board Members at Arm’s Length",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "9776a975-5815-4d88-8f2b-784702247a09",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "03686cfa-0c0d-45a4-b7c6-44e4ea695121",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "50def699-2a36-4dde-b222-9f20c7b72e88",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "87a5eaf5-f784-404a-8712-753552698f52",
                "code": "G06",
                "label": "Number of Board Members",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "197d2633-2df7-4e6a-8a1f-6d574c235e40",
                        "label": "3 or more",
                        "sortOrder": 0
                    },
                    {
                        "id": "71f4485e-c7c2-404c-817e-7fa6be3591f9",
                        "label": "1 to 2",
                        "sortOrder": 1
                    },
                    {
                        "id": "f9789f63-892f-47b3-bda0-c9118828400b",
                        "label": "0",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": {
                    "id": "656ed091-ae15-4058-a26d-1ff01f02f2b8",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            }
        ]
    },
    {
        "id": "92355b25-3c8d-4445-8af9-c67b4f6ef2a5",
        "title": "Governance & Leadership Assessment (US)",
        "version": 1,
        "countryCode": "usa",
        "scoreLogic": null,
        "rubric": {
            "id": "40e3812e-a7d6-47af-8268-dab6bcee1ddd",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "7fd949ac-da54-4f33-b117-161331fb4d46",
                "code": "G01",
                "label": "Board Members’ Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "3cf4ed66-d8f7-4940-8d12-50b5f0996e9b",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "6b7bee61-9e31-4310-bb82-bf617559c7d6",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "e28777b6-7171-456f-bc77-2b6e90d70b01",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "84ba11e8-14a1-4b54-88c4-bb28b6c3b396",
                "code": "G02",
                "label": "Board Members’ Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "11f9818b-ff7a-4056-97d4-0ddfeea23846",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "a09890c9-db97-45dd-9641-a37bc64a4297",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "7970bd5b-359e-47d3-98a8-9d666e42a5a6",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "d63853b0-c83d-473c-bf89-ad17d0dc63ef",
                "code": "G03",
                "label": "Leadership Team Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "035a7f7e-bf3e-407d-8e5c-736cae408fbf",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "70ff0f3f-4798-42b3-8504-524796c26441",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "3814cc8e-bf90-4493-a3e1-c5818844fb49",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "420e67fd-e918-41c5-8c64-e038220121ab",
                "code": "G04",
                "label": "Leadership Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "cbc8613d-6044-48e2-9068-328d7a99bb87",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "6955b82d-4e90-4585-9ce3-5f5c4c7d3a27",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "66b842fd-e124-4463-b38c-02cd84eed340",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "95c3dcee-5e42-4a40-b0bc-48499f367fe5",
                "code": "G05",
                "label": "Minimum 3 Board Members at Arm’s Length",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "7f97c6b4-183f-44ca-9d48-e729e43c4172",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "9ad10519-aef4-46eb-89a8-aa50f8c53c62",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "c54c23b0-7614-4bc9-bfa1-0c7843d9c28f",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "8a7c700f-135c-4a05-8aba-1fa61868bb73",
                "code": "G06",
                "label": "Number of Board Members",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "d6d6bea3-f892-4b6a-bf69-efe0417b7a1b",
                        "label": "3 or more",
                        "sortOrder": 0
                    },
                    {
                        "id": "bb643bf3-ac1e-406f-b620-bce7915b7233",
                        "label": "1 to 2",
                        "sortOrder": 1
                    },
                    {
                        "id": "8edc011d-ffd4-4200-90db-c76e5c062505",
                        "label": "0",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": {
                    "id": "870f41a1-02a8-4a43-b5ff-ab3a97e5759b",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            }
        ]
    },
    {
        "id": "575e9a8a-fa08-4a00-b5f3-61b0e06351eb",
        "title": "Governance & Leadership Assessment (UK)",
        "version": 1,
        "countryCode": "uk",
        "scoreLogic": null,
        "rubric": {
            "id": "d99acd28-6d88-4d4d-a813-cfc2d3ba9820",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "6e218e65-b445-49db-81c4-1b31205d7cc4",
                "code": "G01",
                "label": "Board Members’ Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "108d978f-b3f5-4f36-820f-521abff39cbb",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "1d6467c7-01e1-40e0-a10c-e92f04d3cd03",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "ffa6b72e-87b7-4b70-a3cd-5c09e87c95fd",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "0b22d359-1e80-4ef4-8b97-4a53b04e7032",
                "code": "G02",
                "label": "Board Members’ Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "06c42963-1429-4e64-872a-fd509e2a2ce9",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "eb3fb73c-da2c-41ec-9f55-9eceb029e036",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "99b026ec-d33b-45e8-80ef-248cbfdf1424",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "8f08f70e-668e-483c-8053-0eeda036b205",
                "code": "G03",
                "label": "Leadership Team Names Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "f0da48a9-d702-497d-af17-93edb2bcbb42",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "7f655dcc-0a57-46b2-8b37-e3efd01fc3e9",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "08007461-8ec6-43ea-bac9-36efd493a288",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "81fd2ba2-84cd-43b1-b893-107f990bb779",
                "code": "G04",
                "label": "Leadership Photos Featured on Website",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "0e8b8b49-b4b2-46c8-abca-42cb5af5e563",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "e5be529c-bd30-44dd-b7d5-3fc71a14c795",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "db91e464-a866-4148-9363-53c1568e524f",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "b9bf79c6-e96d-41b8-b310-8f93f4c864e3",
                "code": "G05",
                "label": "Minimum 3 Board Members at Arm’s Length",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "a9317170-73a2-4f8e-95d3-7028ba3e9196",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "a39ed93b-efc8-4efc-8422-1c0e60710a79",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "59788df0-bab2-42b4-bf2e-82706105b4d3",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "ff7bfc5c-8205-4355-adb5-9c6c4e299dfe",
                "code": "G06",
                "label": "Number of Board Members",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "f4b1c540-0c0d-491b-97ab-993852973326",
                        "label": "3 or more",
                        "sortOrder": 0
                    },
                    {
                        "id": "6c38756d-0ba3-4c94-bb69-acfbeb82ed6f",
                        "label": "1 to 2",
                        "sortOrder": 1
                    },
                    {
                        "id": "a50ee7ab-28bc-4af2-80bf-2c2895f33d6f",
                        "label": "0",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": {
                    "id": "0d228fae-fd8d-4a24-9060-e10c2450d49e",
                    "weight": "1",
                    "maxScore": "1",
                    "exclusion": false,
                    "criteria": []
                }
            }
        ]
    }
]
