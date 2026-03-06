using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly IITemFactory _itemFactory;

    public EquipmentController(IITemFactory itemFactory)
    {
        _itemFactory = itemFactory;
    }
    
    [HttpGet("my-gear")]
    public IActionResult GetEquipment()
    {
        var gear = new Equipment
        {
            Id = 1,
            Weapon = _itemFactory.CreateItem("iron sword"),
            BodyArmor = _itemFactory.CreateItem("leather armor"),
            Ring1 = _itemFactory.CreateItem("copper band"),
        };

        return Ok(gear);
    }
}