export function render(component: string, props: Record<string, any>) {
    return {
        appHtml: `<div data-component="${component}">Unit render OK: ${props.message}</div>`,
        head: { title: 'Test Entry' },
    };
}
