import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { libraryConfig } from '../../../scripts/tsdown-library.mjs';

export default libraryConfig(dirname(fileURLToPath(import.meta.url)), { css: true });
