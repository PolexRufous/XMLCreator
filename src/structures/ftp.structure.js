export default {
    ftp: true,
    rest: false,
    base: {
        '?xml version=\"1.0\" encoding=\"UTF-8\"?': null,
        'cor:CoreElement': {
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
    rootxmlns: 'cor',

    elements: {
        CoreElement: {
            name: 'CoreElement',
            xmlns: 'cor',
            required: true,
            path: '',
            isContainer: true,
            children: ['DescriptionElement', 'VersionElement', 'ThirdElement']
        },
        DescriptionElement: {
            standalone: true,
            name: 'DescriptionElement',
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
            xmlns: 'exm',
            required: true,
            path: 'CoreElement',
            isContainer: true,
            children: ['VersionElementInThird', 'DescriptionElementInThird', 'RequestElement']
        },
        VersionElementInThird: {
            standalone: true,
            name: 'VersionElement',
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
            name: 'DescriptionElement',
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
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement',
            isContainer: true,
            children: ['RequestKey', 'RequestValue', 'RequestDescription']
        },
        RequestKey: {
            standalone: true,
            name: 'Key',
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
            name: 'Value',
            xmlns: 'cor',
            required: true,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
        RequestDescription: {
            standalone: true,
            name: 'Description',
            xmlns: 'cor',
            required: false,
            path: 'CoreElement.ThirdElement.RequestElement',
            isContainer: false,
            value: '',
            hasValidValues: false
        },
    }
};