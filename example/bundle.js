/*
 * @Author: chenjianfeng
 * @Date: 2022-07-28 23:45:35
 * @Description: 
 */

((modules) => {
    
    const require = (path) => {
        
        const fn = modules[path]
    
        const module = {
            exports: {}
        }
    
        fn(require, module, module.exports)
    
        return module.exports
    
    }
    
    require('./main.js')
})(
    {
        './main.js': (require, module, exports) => {
            const { entry } = require('./components/index.js')
        
            entry()
            
            console.log('This is main.js')
        },
        './components/index.js': (require, module, exports) => {
            const { getName } = require('./components/bar.js')
        
            getName()
        
            const entry = () => {
                console.log('This is component entry!')
            }
        
            module.exports = {
                entry
            }
        },
        './components/bar.js': (require, module, exports) => {
            const name = 'bar'
        
            const getName = () => name
        
            module.exports = {
                getName
            }
        }
    }
)