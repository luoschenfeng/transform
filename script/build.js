import fs from 'fs/promises'
import { transformSync } from '@babel/core'

const config = {
    input: 'src',
    output: 'dist'
}
async function readSource () {
    const fileHandle = await fs.open(`./${config.input}/index.js`, 'r+')
    return fileHandle.readFile({encoding: 'utf8'})
}
async function readOption () {
    const fileHandle = await fs.open('./babel.config.json', 'r+')
    return fileHandle.readFile({encoding: 'utf8'})
}

async function output (dist) {
    try {
        await fs.access(config.output)
        await fs.rm(config.output, {recursive: true})
    }catch (err) {
    }
    await fs.mkdir(`${config.output}`)
    const fileHandle = await fs.open(`./${config.output}/index.js`, 'w')
    const sourceMap = '\n //# sourceMappingURL=index.js.map'
    await fileHandle.write(dist.code + sourceMap, 0, {encoding: 'utf8'})
    await fileHandle.close()
    if (dist.map) {
        const fileHandleMap = await fs.open(`./${config.output}/index.js.map`, 'w')
        await fileHandleMap.writeFile(JSON.stringify(dist.map), {encoding: 'utf8'})
        await fileHandleMap.close()
    } else {
        try {
            await fs.access(`./${config.output}/index.js.map`)
            await fs.rm(`./${config.output}/index.js.map`)
        } catch (err) {
        }
    }
    console.log(`build to '${config.output}/index.js' success`)
}


async function build () {
    const source = await readSource()
    const option = JSON.parse(await readOption())
    const dist = transformSync(source, option);
    await output(dist)
}

build()

