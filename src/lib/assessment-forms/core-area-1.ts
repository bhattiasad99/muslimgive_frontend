
import { FormDefinition } from './types';

export const CORE_AREA_1_FORMS: FormDefinition[] = [
    {
        "id": "b4c603b6-12ce-4dc1-8415-447de2829a1e",
        "title": "Charity Status (UK)",
        "version": 1,
        "countryCode": "united-kingdom",
        "scoreLogic": "if answers['CS03'] == 'Registered' or (answers['CS03'] == 'Pending Registration' and answers['CS06'] == 'Yes') then 10 else 0",
        "rubric": {
            "id": "e7b4479a-2986-450e-a588-a89521502aa2",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "e274660f-89f5-4376-a1f6-737f2157bfa1",
                "code": "CS01",
                "label": "Charity Number",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "42fa1264-c256-420f-9831-47bf2c8f36d5",
                "code": "CS02",
                "label": "Charity Commission Profile Link",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "10f7e008-c030-4714-aa14-0b7a40cb0b4f",
                "code": "CS03",
                "label": "Registration Status",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "9461cb1c-9f7f-4e36-91ef-00c6f01235b0",
                        "label": "Registered",
                        "sortOrder": 0
                    },
                    {
                        "id": "91941001-81b5-4a66-a8ca-17b419043c9c",
                        "label": "Pending Registration",
                        "sortOrder": 1
                    },
                    {
                        "id": "f192af4c-b70b-40f6-8fd5-2b1792f6af90",
                        "label": "Not Registered",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "773c8084-0296-4f59-81ba-d6d0121bb855",
                "code": "CS04",
                "label": "Gift Aid Eligible",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "7a96ba6e-5657-44bb-a23c-6f1634b997e2",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "11c1f082-5848-4bbe-9e87-e6b82c9a7008",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "ff5a1009-357c-4fdd-a323-3944ab130c82",
                "code": "CS05",
                "label": "Link to Gift Aid status",
                "type": "text",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "0a01f1df-fe53-4908-8bfa-2d1fb2df8fba",
                "code": "CS06",
                "label": "Evidence for Pending Registration Provided (Yes/No)",
                "type": "radio",
                "required": false,
                "scoreLogic": "if answers['CS03'] == 'Pending Registration' and answers['CS06'] == 'Yes' then 1 else 0",
                "options": [
                    {
                        "id": "e78f0a23-b98c-4714-9481-765ff27dda85",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "b82967e0-1f5b-4504-88b8-db6f315e2d14",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "fdbc8e43-7e97-436c-a162-0a2383a1effe",
                    "weight": "1",
                    "maxScore": "0",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "b0b3ccc4-e3a9-4f49-942c-b0467d34e583",
                "code": "CS07",
                "label": "Evidence Link (if applicable)",
                "type": "text",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "6d550b6b-c35b-441b-87ef-32a219b8de9e",
                "code": "CS09",
                "label": "Registration Date",
                "type": "date",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "4669a927-5f87-4f39-a337-de6347c5fcd5",
                "code": "CS10",
                "label": "Status Evidence Type",
                "type": "radio",
                "required": false,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "ef7304db-2a57-46d9-9f56-e0779d50ef59",
                        "label": "Upload File",
                        "sortOrder": 0
                    },
                    {
                        "id": "97c96abf-5fe7-4aee-bd8e-efb2da15fee2",
                        "label": "Provide Link",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "2570d6c5-9814-4bd2-b4c4-d7777fe874b3",
                "code": "CS11",
                "label": "Status Evidence File (if applicable)",
                "type": "file",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "a0a8224a-71dd-4681-9bd0-474f11101fb9",
                "code": "CS08",
                "label": "Status Notes",
                "type": "paragraph",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            }
        ]
    },
    {
        "id": "58ed8f9b-1ba9-426c-9fed-c98a66f67ad6",
        "title": "Charity Status (CANADA)",
        "version": 1,
        "countryCode": "canada",
        "scoreLogic": "if answers['CS03'] == 'Registered' or (answers['CS03'] == 'Pending Registration' and answers['CS05'] == 'Yes') then 10 else 0",
        "rubric": {
            "id": "24ac1c90-8b50-4bbb-bba5-371717c3605b",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "e44e71ba-b36b-454d-bd70-b1b0d6f5f6c4",
                "code": "CS01",
                "label": "Charity Registration Number",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "cf81a499-d923-44c0-8869-a788c34ab4cb",
                "code": "CS02",
                "label": "CRA Profile Link",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "40aad99d-214d-499a-ab8c-d6a7e9fca45e",
                "code": "CS03",
                "label": "Registration Status",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "880512f0-bb46-41e5-9383-71aeda871bf2",
                        "label": "Registered",
                        "sortOrder": 0
                    },
                    {
                        "id": "c96a5c8c-8f37-4a27-a8e6-769639da7442",
                        "label": "Pending Registration",
                        "sortOrder": 1
                    },
                    {
                        "id": "2b6a6e3a-3170-4959-a98f-ab2d9029986e",
                        "label": "Not Registered",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "4edf3b4d-41ce-43ed-afeb-4c8c6b4a5486",
                "code": "CS04",
                "label": "Tax-Deductible",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "5c3ab168-d268-4650-9ad2-3605d8738533",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "d98ff4ca-a92e-4951-921b-c273b8e776a7",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "f959c509-2d53-4581-a737-ef0a1011fdc2",
                "code": "CS05",
                "label": "Evidence for Pending Registration Provided (Yes/No)",
                "type": "radio",
                "required": false,
                "scoreLogic": "if answers['CS03'] == 'Pending Registration' and answers['CS05'] == 'Yes' then 1 else 0",
                "options": [
                    {
                        "id": "c731eef3-c09f-4be2-aa68-891feddd0aa0",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "3e772fec-7531-407b-9421-6b67ad7bd146",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "d403d027-46de-4fba-95a5-6bb57b35c122",
                    "weight": "1",
                    "maxScore": "0",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "8b953e18-f794-4a25-b639-39ed766c2c3f",
                "code": "CS06",
                "label": "Evidence Link (if applicable)",
                "type": "text",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "0f7fce27-7f34-4b91-afb7-5ad317c86cdc",
                "code": "CS09",
                "label": "Registration Date",
                "type": "date",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "683240f7-8c13-4215-9a68-745ad55801c7",
                "code": "CS10",
                "label": "Status Evidence Type",
                "type": "radio",
                "required": false,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "455b6f03-13da-4aba-b75e-2b9e58253c8f",
                        "label": "Upload File",
                        "sortOrder": 0
                    },
                    {
                        "id": "6f13de7f-85bc-499c-ade5-155008776c3f",
                        "label": "Provide Link",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "45f9b93a-53ae-4fbb-b3de-86e231dbbd1c",
                "code": "CS11",
                "label": "Status Evidence File (if applicable)",
                "type": "file",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "a6be690c-81d9-4cb9-acb3-cdf3c85ea111",
                "code": "CS07",
                "label": "Status Notes",
                "type": "paragraph",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            }
        ]
    },
    {
        "id": "1fc7bc66-8c19-4a8f-9422-adeeee5db7ba",
        "title": "Charity Status (US)",
        "version": 1,
        "countryCode": "united-states",
        "scoreLogic": "if answers['CS03'] == 'Registered' or (answers['CS03'] == 'Pending Registration' and answers['CS05'] == 'Yes') then 10 else 0",
        "rubric": {
            "id": "f6de6c80-80e4-488c-b75a-50cb8fdab279",
            "gradeThresholds": {},
            "isActive": true,
            "version": 1
        },
        "questions": [
            {
                "id": "be0dcc42-0a8b-44b8-a5cd-a95ced8c61a4",
                "code": "CS01",
                "label": "EIN (Employer ID Number)",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "ca23108f-ddf3-4469-8e0d-f4d08ed19d1a",
                "code": "CS02",
                "label": "IRS Profile Link",
                "type": "text",
                "required": true,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "2249bb3d-3a7a-49f9-ac5d-c12235fc25e1",
                "code": "CS03",
                "label": "Registration Status",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "2afa0b99-6cfb-464a-b190-26753bff66d8",
                        "label": "Registered",
                        "sortOrder": 0
                    },
                    {
                        "id": "988f73d2-228a-407e-9af9-23f48a0055a7",
                        "label": "Pending Registration",
                        "sortOrder": 1
                    },
                    {
                        "id": "6c4162bb-7080-4900-b0d8-3c7aec1e7f3e",
                        "label": "Not Registered",
                        "sortOrder": 2
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "37799389-121a-4bba-8c69-dc78d6e4b704",
                "code": "CS04",
                "label": "Tax-Deductible",
                "type": "radio",
                "required": true,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "2aa514f6-8a63-4812-a53d-2abb92742b9b",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "1204c75d-2f63-417b-8fd1-a4ff62190962",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "7247f450-2c85-490d-9a27-35bb4f966bd3",
                "code": "CS05",
                "label": "Evidence for Pending Registration Provided (Yes/No)",
                "type": "radio",
                "required": false,
                "scoreLogic": "if answers['CS03'] == 'Pending Registration' and answers['CS05'] == 'Yes' then 1 else 0",
                "options": [
                    {
                        "id": "21e4458f-2472-4d47-a0d6-ff3cb9b3017c",
                        "label": "Yes",
                        "sortOrder": 0
                    },
                    {
                        "id": "289118d0-557b-4b88-b771-161e7a5d7ddb",
                        "label": "No",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": {
                    "id": "370bf6ca-ae10-4c75-8990-a6f274e85ba8",
                    "weight": "1",
                    "maxScore": "0",
                    "exclusion": false,
                    "criteria": []
                }
            },
            {
                "id": "a9991050-8380-4fa2-b153-75da84f9af3b",
                "code": "CS06",
                "label": "Evidence Link (if applicable)",
                "type": "text",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "2e0f708f-eafa-4fa3-aba6-e206b36267c0",
                "code": "CS09",
                "label": "Registration Date",
                "type": "date",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "fc672422-5300-4a06-979a-61ff9069f483",
                "code": "CS10",
                "label": "Status Evidence Type",
                "type": "radio",
                "required": false,
                "scoreLogic": null,
                "options": [
                    {
                        "id": "ad87253b-6f84-4729-b046-49b83d2e3183",
                        "label": "Upload File",
                        "sortOrder": 0
                    },
                    {
                        "id": "d3b22895-8305-4079-9697-c7da506edd60",
                        "label": "Provide Link",
                        "sortOrder": 1
                    }
                ],
                "rubricItem": null
            },
            {
                "id": "39c3cbe4-4985-4858-96c0-e0ec2e45d116",
                "code": "CS11",
                "label": "Status Evidence File (if applicable)",
                "type": "file",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            },
            {
                "id": "12465413-35db-47f1-9ae7-f2bf373b57a8",
                "code": "CS07",
                "label": "Status Notes",
                "type": "paragraph",
                "required": false,
                "scoreLogic": null,
                "options": [],
                "rubricItem": null
            }
        ]
    }
]
