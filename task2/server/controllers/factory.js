export const createController = (Model) => ({
    getAll: async (req, res) => {
        try {
            const items = await Model.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            // Generate ID if not provided (primary key is string and not auto-increment)
            if (!req.body.id) {
                const prefix = Model.name.toLowerCase().substring(0, 4); // prod, work, even
                const shortPrefix = prefix === 'prod' ? 'prod' : (prefix === 'work' ? 'wk' : (prefix === 'even' ? 'evt' : prefix));
                req.body.id = `${shortPrefix}-${Date.now()}`;
            }
            const item = await Model.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            await item.update(req.body);
            res.json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const item = await Model.findByPk(req.params.id);
            if (!item) return res.status(404).json({ message: 'Item not found' });
            await item.destroy();
            res.json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});
