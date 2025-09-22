import { describe, it, expect } from 'vitest';
import { renderPage } from '../../src/renderPage';
import { unitConfig } from '../testConfig';

describe('renderPage', () => {
    it('wraps content with head and body', () => {
        const html = renderPage('<div>Inner</div>', 'TestComp', { msg: 'ok' }, { title: 'My Title' }, unitConfig);

        expect(html).toContain('<title>My Title</title>');
        expect(html).toContain('<div>Inner</div>');
        expect(html).toContain('TestComp');
    });
});
