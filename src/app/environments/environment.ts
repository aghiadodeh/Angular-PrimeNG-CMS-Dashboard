const baseUrl = "http://localhost:3000";
export const environment = {
    SERVER_BASE_URL: baseUrl,
    API_URL: `${baseUrl}/api`,
    PAGE_SIZE: 15,
    DEFAULT_COLOR: '#2196F3',
    DIALOG_CONFIGURATION: {
        width: '50vw',
        contentStyle: { overflow: 'auto' },
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
    },
}