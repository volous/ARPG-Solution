namespace API.Models;

public interface IITemFactory
{
    Item CreateItem(string itemName);
    Item CreateRandomLoot(int powerLevel);
}