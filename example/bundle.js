/*
 * @Author: chenjianfeng
 * @Date: 2022-07-28 23:45:35
 * @Description: 
 */

((modules) => {
    
    const require = (id) => {
        debugger
        const [fn, mapping] = modules[id]
    
        const module = {
            exports: {}
        }
    
        // mapping -> { './components/index.js': 1 }
        const enforceRequire = (path) => {
            const id = mapping[path]
            return require(id)
        }

        fn(enforceRequire, module, module.exports)
    
        return module.exports
    
    }
    
    require(0)
})(
    {
        0: [(require, module, exports) => {
            const { entry } = require('./components/index.js')
        
            entry()
            
            console.log('This is main.js')
        }, { 
            './components/index.js': 1 
        }],
        1: [(require, module, exports) => {
            const { getName } = require('./components/bar.js')
        
            getName()
        
            const entry = () => {
                console.log('This is component entry!')
            }
        
            module.exports = {
                entry
            }
        }, { 
            './components/bar.js': 2 
        }],
        2: [(require, module, exports) => {
            const name = 'bar'
        
            const getName = () => name
        
            module.exports = {
                getName
            }
        }, {}]
    }
)