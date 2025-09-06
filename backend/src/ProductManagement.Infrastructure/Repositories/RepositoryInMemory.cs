using ProductManagement.Domain.Interfaces;

namespace ProductManagement.Infrastructure.Repositories
{
    public class RepositoryInMemory<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly List<TEntity> _entities = [];

        public Task<IEnumerable<TEntity>> GetAllAsync() => Task.FromResult(_entities.AsEnumerable());

        public Task<TEntity?> GetByIdAsync(Guid id)
        {
            var entity = _entities.FirstOrDefault(e =>
            {
                var prop = e.GetType().GetProperty("Id");
                return prop != null && (Guid)prop.GetValue(e)! == id;
            });
            return Task.FromResult(entity);
        }

        public Task AddAsync(TEntity entity)
        {
            var prop = entity.GetType().GetProperty("Id");
            if (prop != null)
            {
                var currentId = (Guid)prop.GetValue(entity)!;
                if (currentId == Guid.Empty)
                {
                    prop.SetValue(entity, Guid.NewGuid());
                }
            }

            _entities.Add(entity);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(TEntity entity)
        {
            var prop = entity.GetType().GetProperty("Id");
            if (prop == null) return Task.CompletedTask;
            var id = (Guid)prop.GetValue(entity)!;
            var index = _entities.FindIndex(e =>
            {
                var p = e.GetType().GetProperty("Id");
                return p != null && (Guid)p.GetValue(e)! == id;
            });
            if (index != -1) _entities[index] = entity;
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id)
        {
            var index = _entities.FindIndex(e =>
            {
                var p = e.GetType().GetProperty("Id");
                return p != null && (Guid)p.GetValue(e)! == id;
            });
            if (index != -1) _entities.RemoveAt(index);
            return Task.CompletedTask;
        }
    }
}
