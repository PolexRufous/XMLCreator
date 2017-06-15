export default {
    ftp: true,
    rest: false,
    base: {
        '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
        'cor:Core': {
            '@': {
                'xmlns:exm': "http://www.example.com/exmp",
                'xmlns:cor': "http://www.example.com/core",
                'xsi:schemaLocation': "http://www.example.com/exmp Example.xsd" +
                "http://www.example.com/core Core.xsd",
                'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance"
            },
            '#': {}
        }
    },

    root: 'CoreElement',
    xmlroot: 'Core',
    rootxmlns: 'cor',

    elements: {
        CoreElement: {
            name: 'CoreElement',
            displayName: 'Core',
            xmlns: 'cor',
            required: true,
            path: '',
            isContainer: true,
            children: ['DescriptionElement', 'VersionElement', 'ThirdElement']
        },
        DescriptionElement: {
            standalone: true,
            name: 'DescriptionElement',
            displayName: 'Description',
            xmlns: 'exm',
            required: true,
            path: 'CoreElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
        VersionElement: {
            standalone: true,
            name: 'VersionElement',
            displayName: 'Version',
            xmlns: 'exm',
            required: true,
            path: 'CoreElement',
            isContainer: false,
            value: '',
            hasValidValues: true,
            validValues: ['1.00', '1.01', '1.02']
        },
        ThirdElement: {
            standalone: true,
            name: 'ThirdElement',
            displayName: 'ThirdElement',
            xmlns: 'exm',
            required: true,
            path: 'CoreElement',
            isContainer: true,
            children: ['VersionElementInThird', 'DescriptionElementInThird', 'RequestElement']
        },
        VersionElementInThird: {
            standalone: true,
            name: 'VersionElementInThird',
            displayName: 'Version',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement',
            isContainer: false,
            value: '',
            hasValidValues: true,
            validValues: ['1.00', '1.01', '1.02']
        },
        DescriptionElementInThird: {
            standalone: true,
            name: 'DescriptionElementInThird',
            displayName: 'Description',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
        RequestElement: {
            standalone: false,
            name: 'RequestElement',
            displayName: 'Request',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement',
            isContainer: true,
            children: ['RequestKey', 'RequestValue', 'RequestDescription', 'RequestAdditional']
        },
        RequestKey: {
            standalone: true,
            name: 'RequestKey',
            displayName: 'Key',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: true,
            validValues: ['Name', 'State', 'Xref']
        },
        RequestValue: {
            standalone: true,
            name: 'RequestValue',
            displayName: 'Value',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
        RequestDescription: {
            standalone: true,
            name: 'RequestDescription',
            displayName: 'Description',
            xmlns: 'cor',
            required: false,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
        RequestAdditional: {
            standalone: false,
            name: 'RequestAdditional',
            displayName: 'Additional',
            xmlns: 'cor',
            required: false,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
    }
};