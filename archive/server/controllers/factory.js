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
    }
});
