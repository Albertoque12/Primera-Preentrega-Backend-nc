const fs = require('fs')


class ProductManager {
    constructor() {
        this.filepath = './data/data.json'
    }

    async #readFile(){
        try {
            const content = await fs.promises.readFile(this.filepath, "utf-8")
            const parseContent = JSON.parse(content)
            return parseContent
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(){
        const fileContent = await this.#readFile()
        try {
            if(fileContent.length === 0) throw new Error("Not products found")
            else console.log(fileContent)
        } catch (error) {
            console.log("Not products found")
        }
    }

    async #checkProductCode(code) {
        const fileContent = await this.#readFile()
        return fileContent.find((obj) => obj.code === code)
    }
    
    async addProduct(obj){
        const fileContent = await this.#readFile()
        if (await this.#checkProductCode(obj.code)) return console.log(`Product with code ${obj.code} is already added to the cart`);
        
        try {

            if(fileContent.length !== 0) await fs.promises.writeFile(this.filepath, JSON.stringify([...fileContent, {...obj, id: fileContent[fileContent.length -1].id + 1}], null, 2), 'utf-8')
            else await fs.promises.writeFile(this.filepath, JSON.stringify([{...obj, id: 1}]), 'utf-8')
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id){
        try {
            const fileContent = await this.#readFile()

            if(!fileContent.find((obj) => obj.id === id)) throw new Error (`Product with Id ${id} was not found`)
            else console.log(fileContent.find((obj) => obj.id === id));
        } catch {
            console.log(`Product with Id ${id} was not found`);
        }
    }

    async updateProduct(id, obj) {
        try {
        const fileContent = await this.#readFile()
        const updated = fileContent.map((product) => product.id === id ? {...product, ...obj} : product )
        if (!fileContent.find((obj) => obj.id === id)) throw new Error(`Product with Id ${id} was not found`)
        else await fs.promises.writeFile(this.filepath, JSON.stringify(updated, null, 2))

    } catch (error) {
        console.log(`Product with id ${id} was not found`);
    }
    }

    async deleteProductById(id) {
        try{
        const fileContent = await this.#readFile()
        const productsFiltered = fileContent.filter((product) => product.id !== id)

        if(!fileContent.find((obj) => obj.id === id)) throw new Error(`Product with id ${id} not found`)
        else await fs.promises.writeFile(this.filepath, JSON.stringify(productsFiltered, null, 2))
    
    } catch (error) {
        console.log(error);
    }}
}

module.exports = ProductManager;


const newProductManager = new ProductManager()
//newProductManager.addProduct()
newProductManager.getProducts()
//newProductManager.getProductById(2)
//newProductManager.updateProduct(1, {description: "Objeto esférico"})
//newProductManager.deleteProductById(1)